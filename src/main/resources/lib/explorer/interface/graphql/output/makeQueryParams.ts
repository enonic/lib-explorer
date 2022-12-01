import type {QueryDsl} from '/lib/xp/node';
import type {
	AnyObject,
	InterfaceField
} from '/lib/explorer/types/index.d';
import type {Profiling} from '/lib/explorer/interface/graphql/output/index.d';
import {SynonymsArray} from '/lib/explorer/synonym/index.d';
import type {Highlight} from '../highlight/input/index.d';


import {
	addQueryFilter,
	forceArray,
	isSet//,
	//toStr
} from '@enonic/js-utils';
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
//import {currentTimeMillis} from '/lib/explorer/time/currentTimeMillis';
import {
	createAggregation,
	createFilters
	//@ts-ignore
} from '/lib/guillotine/util/factory';
import {makeQuery} from './makeQuery';
import {
	highlightGQLArgToEnonicXPQuery
} from '../highlight/input/highlightGQLArgToEnonicXPQuery';
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
	queryArg,
	start, // default is undefined which means 0
	stemmingLanguages = [],
} :{
	aggregationsArg :Array<AnyObject>
	doProfiling ?:boolean
	fields :Array<InterfaceField>
	filtersArg ?:Array<AnyObject>
	highlightArg ?:Highlight
	interfaceId :string
	languages :Array<string>
	localesInSelectedThesauri :Array<string>
	profilingArray ?:Array<Profiling>
	profilingLabel ?:string
	searchString :string
	stopWords :Array<string>
	synonymsSource :SynonymsArray
	thesauriNames :Array<string>
	// Optional
	count ?:number
	logSynonymsQuery ?:boolean
	logSynonymsQueryResult ?:boolean
	queryArg?: QueryDsl,
	start ?:number
	stemmingLanguages ?:Array<string>
}) {
	//log.debug('makeQueryParams highlightArg:%s', toStr(highlightArg));

	const aggregations = {};
	if (aggregationsArg) {
		//log.debug('makeQueryParams aggregationsArg:%s', toStr(aggregationsArg));
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
			filter: hasValue('_nodeType', [NT_DOCUMENT])//,
			//filters: {}
		})
	});
	//log.debug('staticFilter:%s', toStr(staticFilter));

	let filtersArray :Array<AnyObject>;
	if (filtersArg) {
		// This works magically because fieldType is an Enum?
		filtersArray = createFilters(resolveFieldShortcuts({
			basicObject: filtersArg
		}));
		//log.debug('filtersArray:%s', toStr(filtersArray));
		filtersArray.push(staticFilter as unknown as AnyObject);
		//log.debug('filtersArray:%s', toStr(filtersArray));
	}

	let query = queryArg;
	let synonyms = [];
	if (!queryArg) {
		const explorerRepoReadConnection = connect({ principals: [PRINCIPAL_EXPLORER_READ] });

		const washedSearchString = wash({string: searchString});
		const listOfStopWords = [];
		if (stopWords && stopWords.length) {
			//log.debug(`stopWords:${toStr(stopWords)}`);
			stopWords.forEach((name) => {
				const {words} = getStopWordsList({ // Not a query
					connection: explorerRepoReadConnection,
					name
				});
				//log.debug(`words:${toStr(words)}`);
				words.forEach((word) => {
					if (!listOfStopWords.includes(word)) {
						listOfStopWords.push(word);
					}
				});
			});
		}
		//log.debug(`listOfStopWords:${toStr({listOfStopWords})}`);
		const removedStopWords = [];
		const searchStringWithoutStopWords = removeStopWords({
			removedStopWords,
			stopWords: listOfStopWords,
			string: washedSearchString
		});

		//log.debug('fields:%s', toStr(fields));
		query = makeQuery({
			fields,
			searchStringWithoutStopWords,
			stemmingLanguages
		});
		//log.debug('query:%s', toStr(query));

		synonyms = isSet(synonymsSource)
			? synonymsSource
			: getSynonymsFromSearchString({
				//expand,
				//explain,
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
		//log.debug('synonyms:%s', toStr(synonyms));

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
				if (!appliedFulltext.includes(synonym)) {
					const aSynonymFulltextQuery = {
						fulltext: {
							fields: fields.map(({name}) => name), // NOTE: No boosting
							operator: 'AND',
							query: synonym
						}
					};
					//@ts-ignore // We know it's a list
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
						//@ts-ignore // We know it's a list
						query.boolean.should.push(aSynonymStemmedQuery);
					} else {
						log.warning(`Unable to guess stemmingLanguage from locale:${locale}`);
					} // stemmingLanguage
				} // !zxx
			} // for synonymsToApply[j]
		} // for synonyms[i]
	}

	return {
		queryParams: {
			aggregations,
			count,
			filters: filtersArray ? filtersArray : staticFilter,
			highlight: highlightArg
				? highlightGQLArgToEnonicXPQuery({highlightArg})
				: null,
			query,
			start,
		},
		synonyms
	};
}
