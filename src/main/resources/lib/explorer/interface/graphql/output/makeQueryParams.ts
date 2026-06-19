import type { Aggregations } from '@enonic-types/core';
import type {
	FieldSortDsl,
	Filter,
	QueryNodeParams,
} from '/lib/xp/node';
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
	toStr,
} from '@enonic/js-utils';
import { includes as arrayIncludes } from '@enonic/js-utils/array/includes';
import { includes as strIncludes } from '@enonic/js-utils/string/includes';
import { isSet } from '@enonic/js-utils/value/isSet';
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
import { isNotNil } from '/lib/explorer/typeGuards/isNotNil';

import {
	createAggregation,
	createFilters
	// @ts-ignore
} from '/lib/guillotine/util/factory';
import {makeQuery} from './makeQuery';
import {highlightGQLArgToEnonicXPQuery} from '/lib/explorer/interface/graphql/highlight/input/highlightGQLArgToEnonicXPQuery';
import {resolveFieldShortcuts} from './resolveFieldShortcuts';
import { noNilsArray } from '/lib/explorer/array/noNilsArray';


const TRACE = false;


export function makeQueryParams({
	_trace = TRACE,
	aggregationsArg,
	explainArg,
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
	_trace?: boolean;
	aggregationsArg: AnyObject[]
	doProfiling?: boolean
	explainArg?: boolean;
	fields: InterfaceField[]
	filtersArg?: AnyObject[]
	highlightArg?: GQL_InputType_Highlight;
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
	if (_trace) log.debug('makeQueryParams highlightArg:%s', toStr(highlightArg));

	const aggregations = {};
	if (aggregationsArg) {
		if (_trace) log.debug('makeQueryParams aggregationsArg:%s', toStr(aggregationsArg));
		forceArray(resolveFieldShortcuts({
			basicObject: aggregationsArg
		})).forEach(aggregation => {
			// This works magically because fieldType is an Enum.
			createAggregation(aggregations, aggregation);
		});
	}

	const staticFilters = noNilsArray(addQueryFilter({
		filter: {
			exists: {
				field: `${FIELD_PATH_META}.documentType` // Avoid nullpointer exception, this is needed in interfaceTypeResolver
			}
		},
		filters: addQueryFilter({
			filter: hasValue('_nodeType', [NT_DOCUMENT])// ,
			// filters: {}
		})
	}));
	if (_trace) log.debug('staticFilters:%s', toStr(staticFilters));

	let filtersArray: Filter[] | undefined;
	if (filtersArg) {
		// This works magically because fieldType is an Enum?
		filtersArray = createFilters(resolveFieldShortcuts({
			basicObject: filtersArg
		}));
		if (_trace) log.debug('filtersArray:%s', toStr(filtersArray));
		for (const staticFilter of staticFilters) {
			(filtersArray as Filter[]).push(staticFilter);
		}
		if (_trace) log.debug('filtersArray:%s', toStr(filtersArray));
	}

	// let query = queryArg;
	// let synonyms = [];
	// if (!queryArg) {
	const explorerRepoReadConnection = connect({ principals: [PRINCIPAL_EXPLORER_READ] });

	if (_trace) log.debug('searchString:%s', toStr(searchString));
	const washedSearchString = wash({ string: searchString });
	if (_trace) log.debug('washedSearchString:%s', toStr(washedSearchString));

	const listOfStopWords: string[] = [];
	if (stopWords && stopWords.length) {
		if (_trace) log.debug('stopWords:%s', toStr(stopWords));
		stopWords.forEach((name) => {
			const maybeStopWordsList = getStopWordsList({ // Not a query
				connection: explorerRepoReadConnection,
				name
			});
			if (maybeStopWordsList) {
				const { words } = maybeStopWordsList;
				if (_trace) log.debug('words:%s', toStr(words));
				words.forEach((word) => {
					if (!arrayIncludes(listOfStopWords, word)) {
						listOfStopWords.push(word);
					}
				});
			}
		});
	}
	if (_trace) log.debug('listOfStopWords:%s', toStr(listOfStopWords));
	const removedStopWords: string[] = [];
	const searchStringWithoutStopWords = removeStopWords({
		removedStopWords,
		stopWords: listOfStopWords,
		string: washedSearchString
	});
	if (_trace) log.debug('searchStringWithoutStopWords:%s', toStr(searchStringWithoutStopWords));

	if (_trace) log.debug('fields:%s', toStr(fields));
	let fieldsAndHighlight: InterfaceField[] | undefined;
	if (highlightArg && highlightArg.fields.length) {
		fieldsAndHighlight = JSON.parse(JSON.stringify(fields)) as InterfaceField[];
		const lcInterfaceFieldNames = fields.map(({name}) => name.toLocaleLowerCase());
		for (const {field} of highlightArg.fields as { field: string; }[]) {
			const lcField = field.toLocaleLowerCase();
			if (
				!strIncludes(field, '._stemmed_')
				&& !arrayIncludes(lcInterfaceFieldNames, lcField)
				&& lcField !== '_alltext' // avoid double (since added in makeQuery)
			) {
				fieldsAndHighlight.push({
					// boost: 1, // Flat no boost
					name: field,
				});
			}
		}
		if (_trace) log.debug('fieldsAndHighlight:%s', toStr(fieldsAndHighlight));
	}

	const query = searchStringWithoutStopWords
		? makeQuery({
			fields: fieldsAndHighlight || fields,
			searchStringWithoutStopWords,
			stemmingLanguages,
			termQueries
		})
		: {
			matchAll: {}
		};
	if (_trace) log.debug('query:%s', toStr(query));

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
	if (_trace) log.debug('synonyms:%s', toStr(synonyms));

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

	const queryParams: QueryNodeParams<Aggregations> = {
		aggregations,
		count,
		filters: filtersArray ? filtersArray : staticFilters,
		query,
		sort,
		start,
	};

	if (isNotNil(explainArg)) {
		queryParams.explain = explainArg;
	}

	if (isNotNil(highlightArg)) {
		queryParams.highlight = highlightGQLArgToEnonicXPQuery({ highlightArg });
	}

	return {
		queryParams,
		synonyms
	};
}
