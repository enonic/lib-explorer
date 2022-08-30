import type {RepoConnection} from '/lib/explorer/types/index.d';
import type {SynonymUse} from '/lib/explorer/types/Synonym.d';
import type {QuerySynonymsParams} from '/lib/explorer/synonym/query';
import type {SynonymsArray} from './index.d';


import {
	addQueryFilter,
	forceArray,
	isSet,
	storage,
	toStr
} from '@enonic/js-utils';
import {hasValue} from '/lib/explorer/query/hasValue';
import {replaceSyntax} from '/lib/explorer/query/replaceSyntax';
import {ws} from '/lib/explorer/string/ws';
import {query as querySynonyms} from '/lib/explorer/synonym/query';
import {javaLocaleToSupportedLanguage} from '/lib/explorer/stemming/javaLocaleToSupportedLanguage';
import {washSynonyms} from '/lib/explorer/synonym/washSynonyms';
import {query as queryThesauri} from '/lib/explorer/thesaurus/query';


const fulltext = storage.query.dsl.fulltext;
//const inQuery = storage.query.dsl.inQuery;
const ngram = storage.query.dsl.ngram;
//const or = storage.query.dsl.or;
const stemmed = storage.query.dsl.stemmed;


const MAX_COUNT = 100;


export function getSynonymsFromSearchString({
	// Required
	explorerRepoReadConnection, // Connecting many places leeds to loss of control over principals, so pass a connection around.
	defaultLocales,
	interfaceId,
	// Optional
	count = MAX_COUNT,
	expand = false,
	explain = false,
	locales,
	logQuery = false,
	searchString = '',
	stemming = true,
	showSynonyms = false,
	thesauri,
	useNgram = !stemming
} :{
	// Required
	explorerRepoReadConnection :RepoConnection
	defaultLocales :Array<string>
	interfaceId :string
	// Optional
	count ?:number
	expand ?:boolean
	explain ?:boolean
	locales ?:string|Array<string>
	logQuery ?:boolean
	searchString ?:string
	showSynonyms ?:boolean
	stemming ?:boolean
	thesauri ?:Array<string>
	useNgram ?:boolean
}) :SynonymsArray {
	//log.debug('getSynonymsFromSearchString defaultLocales:%s', toStr(defaultLocales));

	if (!searchString || !thesauri) {
		return [];
	}

	const activeThesauri = queryThesauri({
		connection: explorerRepoReadConnection,
		//filters: , // TODO filter on languages?
		getSynonymsCount: false,
		thesauri
	}).hits.map(({_name}) => _name);
	//log.debug('activeThesauri:%s', toStr(activeThesauri));

	const washedSearchString = ws(replaceSyntax({string: searchString.toLowerCase()}));

	const useArray :Array<SynonymUse> = ['both', 'from'];
	const resultUseArray :Array<SynonymUse> = [
		'both',
		'to',
		'from' // expand handeled in flattenSynonyms
	];
	if (expand) {
		useArray.push('to');
		//resultUseArray.push('from'); // expand handeled in flattenSynonyms
	}
	//log.debug('getSynonymsFromSearchString useArray:%s', toStr(useArray));

	const localesArray = isSet(locales) ? forceArray(locales) : defaultLocales;
	//log.debug('getSynonymsFromSearchString localesArray:%s', toStr(localesArray));

	const fulltextShouldQueries = [];
	const stemmedShouldQueries = [];
	const ngramShouldQueries = [];
	const rootShouldQueries = [];
	const highlightProperties = {};

	if (localesArray && localesArray.length) {
		const fields :Array<string> = [];
		for (let i = 0; i < localesArray.length; i++) {
			const locale = localesArray[i];
			if (showSynonyms) {
				highlightProperties[`languages.${locale}.both.synonym`] = {};
				highlightProperties[`languages.${locale}.from.synonym`] = {};
				if (expand) {
					highlightProperties[`languages.${locale}.to.synonym`] = {};
				}
			}
			useArray.forEach((use) => {
				fields.push(`languages.${locale}.${use}.synonym`);
			});
			if (stemming && locale !== 'zxx') {
				stemmedShouldQueries.push(stemmed(
					useArray.map((use) => `languages.${locale}.${use}.synonym`),
					washedSearchString,
					'AND',
					javaLocaleToSupportedLanguage(locale)
				));
			}
		} // for localesArray
		//log.debug('fields:%s', toStr(fields));
		fulltextShouldQueries.push(fulltext(fields, washedSearchString, 'AND'));
		if (useNgram) {
			ngramShouldQueries.push(ngram(fields, washedSearchString, 'AND'));
		}

		//shouldQueries.push(ngram(fields, searchString, 'AND'));
	} else { // if !localesArray
		fulltextShouldQueries.push(fulltext(
			useArray.map((use) => `languages.*.${use}.synonym`),
			washedSearchString,
			'AND'
		));
		if (useNgram) {
			ngramShouldQueries.push(ngram(
				useArray.map((use) => `languages.*.${use}.synonym`),
				washedSearchString,
				'AND'
			));
		}
	} // if !localesArray
	if (fulltextShouldQueries.length) {
		rootShouldQueries.push({
			boolean: {
				boost: 3,
				should: fulltextShouldQueries
			}
		});
	}
	if (stemmedShouldQueries.length) {
		rootShouldQueries.push({
			boolean: {
				boost: 2,
				should: stemmedShouldQueries
			}
		});
	}
	if (ngramShouldQueries.length) {
		rootShouldQueries.push({
			boolean: {
				boost: 1,
				should: ngramShouldQueries
			}
		});
	}

	const querySynonymsParams :QuerySynonymsParams = {
		connection: explorerRepoReadConnection,
		count: count >= 1 && count <= MAX_COUNT ? count : MAX_COUNT,
		explain,
		filters: addQueryFilter({
			filter: hasValue('_parentPath', activeThesauri.map(n => `/thesauri/${n}`)),
			filters: addQueryFilter({
				filter: hasValue('enabled', [true]),
				filters: addQueryFilter({
					clause: 'mustNot',
					filter: hasValue('disabledInInterfaces', [interfaceId])
				})
			})
		}),
		query: {
			boolean: {
				/*must: {
					in: { // Limit which thesauri to search
						field: '_parentPath',
						values: activeThesauri.map(n => `/thesauri/${n}`)
					},
					term: {
						field: 'enabled',
						value: true
					}
				},
				mustNot: {
					term: {
						field: 'disabledInInterfaces',
						value: interfaceId
					}
				}*/
				should: rootShouldQueries,
			}
		},
		sort: {
			field: '_score',
			direction: 'DESC'
		}
	};

	if (Object.keys(highlightProperties).length) {
		querySynonymsParams.highlight = {
			numberOfFragments: 1,
			postTag: '</b>',
			preTag: '<b>',
			properties: highlightProperties
		};
	}

	if (logQuery) {
		log.info('querySynonymsParams:%s', toStr(querySynonymsParams));
	}

	const querySynonymsRes = querySynonyms(querySynonymsParams);
	//log.debug('querySynonymsRes:%s', toStr(querySynonymsRes));

	const synonyms :SynonymsArray = [];
	for (let i = 0; i < querySynonymsRes.hits.length; i++) {
		const {
			_highlight,
			_score,
			languages,
			thesaurus: thesaurusName,
		} = querySynonymsRes.hits[i];
		//log.debug('_highlight:%s', toStr(_highlight));
		//log.debug('languages:%s', toStr(languages));

		//const from :Array<string> = [];
		//const to :Array<string> = [];
		const synonymsToApply :{
			locale :string
			synonym :string
		}[]= [];
		for (let i = 0; i < languages.length; i++) {
			const language = languages[i];
			const {
				enabled: languageEnabled,
				disabledInInterfaces: languageDisabledInInterfaces,
				locale
			} = language;
			//log.debug('locale:%s', toStr(locale));
			if (
				languageEnabled
				&& !languageDisabledInInterfaces.includes(interfaceId)
				&& localesArray.includes(locale)
			) {
				for (let j = 0; j < resultUseArray.length; j++) {
					const use = resultUseArray[j];
					//log.debug('use:%s', toStr(use));
					const synonymsArray = language[use];
					//log.debug('synonymsArray:%s', toStr(synonymsArray));
					for (let k = 0; k < synonymsArray.length; k++) {
						const {
							enabled,
							disabledInInterfaces,
							synonym
						} = synonymsArray[k];
						if (
							enabled
							&& !disabledInInterfaces.includes(interfaceId)
						) {
							const washedSynonym = washSynonyms(synonym);
							//log.debug('washedSynonym:%s', toStr(washedSynonym));
							if (!washedSearchString.includes(washedSynonym)) {
								if (use === 'from') {
									//if (!from.includes(washedSynonym)) {
									//from.push(washedSynonym);
									if (expand) {
										synonymsToApply.push({
											locale,
											synonym: washedSynonym
										});
									}
									//}
								} else {  // both, to
									//if (!to.includes(washedSynonym)) {
									//to.push(washedSynonym);
									synonymsToApply.push({
										locale,
										synonym: washedSynonym
									});
									//}
								}
							}
						}
					} // for synonymsArray
				} // for resultUseArray
			}
		} // for languages
		//log.debug('from:%s', toStr(from));
		//log.debug('to:%s', toStr(to));
		synonyms.push({
			//from,
			_highlight,
			_score,
			synonyms: synonymsToApply,
			thesaurusName,
			//to
		});
	} // for
	/*log.debug(
		'count:%s expand:%s locales:%s searchString:%s stemming:%s thesauri:%s useNgram:%s synonyms:%s',
		count, expand, locales, searchString, stemming, toStr(thesauri), useNgram, toStr(synonyms)
	);*/
	return synonyms;
} // getSynonymsFromSearchString
