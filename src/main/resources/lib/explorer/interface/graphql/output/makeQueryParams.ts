import type {FieldSortDsl} from '/lib/xp/node';
import type {
	AnyObject,
	InterfaceField
} from '@enonic-types/lib-explorer';
import type {Profiling} from '/lib/explorer/interface/graphql/output/index.d';
import type {SynonymsArray} from '/lib/explorer/synonym/index.d';
import type {TermQuery} from '@enonic-types/lib-explorer/Interface.d';
import type {GQL_InputType_Highlight} from '@enonic-types/lib-explorer/GraphQL.d';
import type { StemmingLanguageCode } from '@enonic/js-utils/types';


import {
	addQueryFilter,
	forceArray,
	isSet,
	// toStr,
} from '@enonic/js-utils';
import { includes as arrayIncludes } from '@enonic/js-utils/array/includes';
import {
	FIELD_PATH_META,
	NT_DOCUMENT,
	PRINCIPAL_EXPLORER_READ
} from '/lib/explorer/constants';
import {connect} from '/lib/explorer/repo/connect';
import {hasValue} from '/lib/explorer/query/hasValue';
import {removeStopWords} from '/lib/explorer/query/removeStopWords';
import {wash} from '/lib/explorer/query/wash';
import {get as getStopWordsList} from '/lib/explorer/stopWords/get';
import {getSynonymsFromSearchString} from '/lib/explorer/synonym/getSynonymsFromSearchString';
import {javaLocaleToSupportedLanguage as stemmingLanguageFromLocale} from '/lib/explorer/stemming/javaLocaleToSupportedLanguage';
import {
	createAggregation,
	createFilters
	// @ts-ignore
} from '/lib/guillotine/util/factory';
import {makeQuery} from './makeQuery';
import {highlightGQLArgToEnonicXPQuery} from '/lib/explorer/interface/graphql/highlight/input/highlightGQLArgToEnonicXPQuery';
import {resolveFieldShortcuts} from './resolveFieldShortcuts';


export function makeQueryParams({
	aggregationsArg,
	fields,
	filtersArg,
	highlightArg,
	interfaceId,
	languages,
	localesInSelectedThesauri,
	searchString = '',
	stopWords,
	synonymsSource,
	thesauriNames,
	// Optional
	count, // default is undefined which means 10
	doProfiling = false,
	logSynonymsQuery = false,
	logSynonymsQueryResult = false,
	profilingArray = [],
	profilingLabel = '',
	// queryArg,
	sort,
	start, // default is undefined which means 0
	stemmingLanguages = [],
	termQueries,
}: {
	aggregationsArg: AnyObject[]
	doProfiling?: boolean
	fields: InterfaceField[]
	filtersArg?: AnyObject[]
	highlightArg?: GQL_InputType_Highlight
	interfaceId: string
	languages: string[]
	localesInSelectedThesauri: string[]
	profilingArray?: Profiling[]
	profilingLabel?: string
	searchString: string
	stopWords: string[]
	synonymsSource: SynonymsArray
	thesauriNames: string[]
	// Optional
	count?: number
	logSynonymsQuery?: boolean
	logSynonymsQueryResult?: boolean
	// queryArg?: QueryDsl,
	sort?: FieldSortDsl[]
	start?: number
	stemmingLanguages?: StemmingLanguageCode[]
	termQueries?: TermQuery[]
}) {
	// log.debug('makeQueryParams highlightArg:%s', toStr(highlightArg));

	const aggregations = {};
	if (aggregationsArg) {
		// log.debug('makeQueryParams aggregationsArg:%s', toStr(aggregationsArg));
		forceArray(resolveFieldShortcuts({
			basicObject: aggregationsArg
		})).forEach(aggregation => {
			// This works magically because fieldType is an Enum.
			createAggregation(aggregations, aggregation);
		});
	}

	const staticFilter = addQueryFilter({
		filter: {
			exists: {
				field: `${FIELD_PATH_META}.documentType` // Avoid nullpointer exception, this is needed in interfaceTypeResolver
			}
		},
		filters: addQueryFilter({
			filter: hasValue('_nodeType', [NT_DOCUMENT])// ,
			// filters: {}
		})
	});
	// log.debug('staticFilter:%s', toStr(staticFilter));

	let filtersArray: AnyObject[];
	if (filtersArg) {
		// This works magically because fieldType is an Enum?
		filtersArray = createFilters(resolveFieldShortcuts({
			basicObject: filtersArg
		}));
		// log.debug('filtersArray:%s', toStr(filtersArray));
		filtersArray.push(staticFilter as unknown as AnyObject);
		// log.debug('filtersArray:%s', toStr(filtersArray));
	}

	// let query = queryArg;
	// let synonyms = [];
	// if (!queryArg) {
	const explorerRepoReadConnection = connect({ principals: [PRINCIPAL_EXPLORER_READ] });

	const washedSearchString = wash({string: searchString});
	const listOfStopWords = [];
	if (stopWords && stopWords.length) {
		// log.debug(`stopWords:${toStr(stopWords)}`);
		stopWords.forEach((name) => {
			const {words} = getStopWordsList({ // Not a query
				connection: explorerRepoReadConnection,
				name
			});
			// log.debug(`words:${toStr(words)}`);
			words.forEach((word) => {
				if (!arrayIncludes(listOfStopWords, word)) {
					listOfStopWords.push(word);
				}
			});
		});
	}
	// log.debug(`listOfStopWords:${toStr({listOfStopWords})}`);
	const removedStopWords = [];
	const searchStringWithoutStopWords = removeStopWords({
		removedStopWords,
		stopWords: listOfStopWords,
		string: washedSearchString
	});

	// log.debug('fields:%s', toStr(fields));
	const query = searchStringWithoutStopWords
		? makeQuery({
			fields,
			searchStringWithoutStopWords,
			stemmingLanguages,
			termQueries
		})
		: {
			matchAll: {}
		};
	// log.debug('query:%s', toStr(query));

	const synonyms = isSet(synonymsSource)
		? synonymsSource
		: getSynonymsFromSearchString({
			// expand,
			// explain,
			explorerRepoReadConnection,
			defaultLocales: localesInSelectedThesauri,
			doProfiling,
			interfaceId,
			locales: languages,
			logQuery: logSynonymsQuery,
			logQueryResult: logSynonymsQueryResult,
			profilingArray,
			profilingLabel,
			searchString: searchStringWithoutStopWords,
			showSynonyms: true, // TODO hardcode
			thesauri: thesauriNames
		});
	// log.debug('synonyms:%s', toStr(synonyms));

	const appliedFulltext = [];
	for (let i = 0; i < synonyms.length; i++) {
		const {
			synonyms: synonymsToApply
		} = synonyms[i];
		for (let j = 0; j < synonymsToApply.length; j++) {
			const {
				locale,
				synonym
			} = synonymsToApply[j];
			if (!arrayIncludes(appliedFulltext, synonym)) {
				const aSynonymFulltextQuery = {
					fulltext: {
						fields: fields.map(({name}) => name), // NOTE: No boosting
						operator: 'AND',
						query: synonym
					}
				};
				// @ts-ignore // We know it's a list
				query.boolean.should.push(aSynonymFulltextQuery);
				appliedFulltext.push(synonym);
			}
			if (locale !== 'zxx') {
				const stemmingLanguage = stemmingLanguageFromLocale(locale);
				if (stemmingLanguage) {
					const aSynonymStemmedQuery = {
						stemmed: {
							fields: fields.map(({name}) => name), // NOTE: No boosting
							operator: 'AND',
							query: synonym,
							language: stemmingLanguageFromLocale(locale)
						}
					};
					// @ts-ignore // We know it's a list
					query.boolean.should.push(aSynonymStemmedQuery);
				} else {
					log.warning(`Unable to guess stemmingLanguage from locale:${locale}`);
				} // stemmingLanguage
			} // !zxx
		} // for synonymsToApply[j]
	} // for synonyms[i]
	// }

	return {
		queryParams: {
			aggregations,
			count,
			// explain: true,
			filters: filtersArray ? filtersArray : staticFilter,
			highlight: highlightArg
				? highlightGQLArgToEnonicXPQuery({highlightArg})
				: null,
			query,
			sort,
			start,
		},
		synonyms
	};
}
