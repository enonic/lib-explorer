import type {
	AnyObject,
	InterfaceField
} from '/lib/explorer/types/index.d';
import type {Highlight} from '../highlight/input/index.d';


import {
	addQueryFilter,
	forceArray//,
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
//import {flattenSynonyms} from '/lib/explorer/synonym/flattenSynonyms';
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
	thesauriNames,
	// Optional
	count, // default is undefined which means 10
	logSynonymsQuery = false,
	start // default is undefined which means 0
} :{
	aggregationsArg :Array<AnyObject>
	fields :Array<InterfaceField>
	filtersArg ?:Array<AnyObject>
	highlightArg ?:Highlight
	interfaceId :string
	languages :Array<string>
	localesInSelectedThesauri :Array<string>
	searchString :string
	stopWords :Array<string>
	thesauriNames :Array<string>
	// Optional
	count ?:number
	logSynonymsQuery ?:boolean
	start ?:number
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
	const query = makeQuery({
		fields,
		searchStringWithoutStopWords
	});
	//log.debug('query:%s', toStr(query));

	const synonyms = getSynonymsFromSearchString({
		//expand,
		//explain,
		explorerRepoReadConnection,
		defaultLocales: localesInSelectedThesauri,
		interfaceId,
		locales: languages,
		logQuery: logSynonymsQuery,
		searchString: searchStringWithoutStopWords,
		showSynonyms: true,
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

	/*const flattenedSynonyms = flattenSynonyms({
		//expand,
		synonyms
	}).map(s => `${s}`); // Removed double quotes https://enonic.zendesk.com/agent/tickets/3714
	//log.debug('flattenedSynonyms:%s', toStr(flattenedSynonyms));

	if (flattenedSynonyms) {
		for (let i = 0; i < flattenedSynonyms.length; i++) {
			//log.debug(`flattenedSynonyms[${i}]:%s`, flattenedSynonyms[i]);
			//log.debug('before query.boolean.should:%s', toStr(query.boolean.should));
			const aSynonymQuery = {
				fulltext: {
					fields: fields.map(({name}) => name), // NOTE: No boosting
					operator: 'AND',
					query: flattenedSynonyms[i]
				}
			};
			//log.debug('aSynonymQuery:%s', toStr(aSynonymQuery));
			//@ts-ignore // We know it's a list
			query.boolean.should.push(aSynonymQuery);
			//log.debug('after query.boolean.should:%s', toStr(query.boolean.should));
		} // for flattenedSynonyms
	}*/
	//log.debug('query:%s', toStr(query));

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
