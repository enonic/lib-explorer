import type { QueryDsl, RepoConnection } from '/lib/xp/node';
import type { InterfaceField } from '@enonic-types/lib-explorer';
import type { InterfaceExpressions, TermQuery } from '@enonic-types/lib-explorer/Interface.d';
import type { StemmingLanguageCode } from '@enonic/js-utils/types';
import type { SynonymsArray } from '/lib/explorer/synonym';
import type { Profiling } from '/lib/explorer/interface/graphql/output/index.d';


import {
	VALUE_TYPE_BOOLEAN,
	VALUE_TYPE_DOUBLE,
	VALUE_TYPE_LONG,
	// VALUE_TYPE_STRING,
	QUERY_OPERATOR_AND,
	storage,
} from '@enonic/js-utils';
import { includes as arrayIncludes } from '@enonic/js-utils/array/includes';
import { isSet } from '@enonic/js-utils/value/isSet';
import { toStr } from '@enonic/js-utils/value/toStr';
import { quoteWordsWithNumbers } from '/lib/explorer/query/quoteWordsWithNumbers';
import { getSynonymsFromSearchString } from '/lib/explorer/synonym/getSynonymsFromSearchString';
import { javaLocaleToSupportedLanguage as stemmingLanguageFromLocale } from '/lib/explorer/stemming/javaLocaleToSupportedLanguage';
import boostedQuery from '/lib/explorer/query/boostedQuery';


const TRACE = false;
const LOG_PREFIX = 'makeQuery:';

const MATCH_ALL: QueryDsl = { matchAll: {} };

const bool = storage.query.dsl.bool;

const atLeastOneMustBeTrue = storage.query.dsl.should;

const term = storage.query.dsl.term;

const fulltext = storage.querying.fulltext;
const ngram = storage.querying.ngram;
const stemmed = storage.querying.stemmed;


interface MakeQueryParams {
	_trace?: boolean;
	doProfiling?: boolean;
	fields: InterfaceField[];
	explorerRepoReadConnection: RepoConnection;
	interfaceId: string;
	languages: string[];
	localesInSelectedThesauri: string[];
	logSynonymsQuery?: boolean;
	logSynonymsQueryResult?: boolean;
	profilingArray?: Profiling[];
	profilingLabel?: string;
	searchStringWithoutStopWords: string;
	synonymsSource: SynonymsArray;
	thesauriNames: string[];
	// Optional
	expressions?: InterfaceExpressions;
	stemmingLanguages?: StemmingLanguageCode[];
	termQueries?: TermQuery[];
}

const SYNOYMS_BOOST_MULTIPLIER = 0.9; // Make synonyms less relevant than direct match.


// There are several variations of the QueryDslObject:
// 1. When the searchString is empty: Just a matchAll.
// 2. When there are NO term boost(s), NOR synoyms.
// 3. When there are term boost(s), but NO synonyms.
// 4. When there are NO term boost(s), but synonyms.
// 5. When there are BOTH term boost(s), and synonyms.

export function makeQuery({
	_trace = TRACE,
	doProfiling = false,
	explorerRepoReadConnection,
	expressions,
	fields,
	interfaceId,
	languages,
	localesInSelectedThesauri,
	logSynonymsQuery = false,
	logSynonymsQueryResult = false,
	profilingArray = [],
	profilingLabel = '',
	searchStringWithoutStopWords,
	synonymsSource,
	thesauriNames,
	// Optional
	stemmingLanguages = [],
	termQueries = [],
}: MakeQueryParams): QueryDsl {
	// No need to build query or process synonyms when searchString is ''.
	if (!searchStringWithoutStopWords) return MATCH_ALL;

	const {
		fulltext: fulltextExpression = {},
		stemmed: stemmedExpression = {},
		nGram: nGramExpression = {},
	} = expressions || {};
	const fulltextBoost = fulltextExpression.boost || 1; // This makes 0 impossible (which is ok, can use disabled instead)
	const stemmedBoost = stemmedExpression.boost || 0.9 // This makes 0 impossible (which is ok, can use disabled instead)

	const fieldsArr = fields.map(({boost, name: field}) => ({boost, field}));
	if (!fieldsArr.filter(({field}) => field === '_alltext').length) {
		fieldsArr.push({
			boost: 1, // Can be overridden in GUI by adding a field boost for _alltext.
			field: '_alltext'
		})
	}
	if (_trace) log.debug('%s fieldsArr:%s', LOG_PREFIX, toStr(fieldsArr));

	const maybeQuotedWords = quoteWordsWithNumbers(searchStringWithoutStopWords);

	const selectionExpressions: QueryDsl[] = [];

	if (!fulltextExpression.disabled) {
		selectionExpressions.push(fulltext(
			// fields.map(({boost, name: field}) => ({boost: (
			// 	parseInt(boost as unknown as string) // In case there are some old interface nodes with boost as string rather than number
			// 	||1) + (fields.length * 2), field})),
			fieldsArr,
			maybeQuotedWords,
			QUERY_OPERATOR_AND,
			fulltextBoost
		));
	}

	if (!stemmedExpression.disabled) {
		for (let i = 0; i < stemmingLanguages.length; i++) {
			const stemmingLanguage = stemmingLanguages[i];
			selectionExpressions.push(stemmed(
				// fields.map(({boost, name: field}) => ({boost: (
				// 	parseInt(boost as unknown as string) // In case there are some old interface nodes with boost as string rather than number
				// 	||1) + fields.length, field})),
				fieldsArr,
				maybeQuotedWords,
				stemmingLanguage,
				QUERY_OPERATOR_AND,
				stemmedBoost
			));
		}
	}

	if (!nGramExpression.disabled) {
		selectionExpressions.push(ngram(
			fieldsArr,
			maybeQuotedWords,
			QUERY_OPERATOR_AND,
			nGramExpression.boost || 0.8 // This makes 0 impossible (which is ok, can use disabled instead)
		));
	}

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

	if (
		!termQueries.length
		&& !synonyms.length
	) return bool(atLeastOneMustBeTrue(selectionExpressions));

	const synonymExpressions: QueryDsl[] = [];
	const appliedFulltext = [];
	for (let i = 0; i < synonyms.length; i++) { // synonyms can still be an empty array.
		const {
			synonyms: synonymsToApply
		} = synonyms[i];
		for (let j = 0; j < synonymsToApply.length; j++) {
			const {
				locale,
				synonym
			} = synonymsToApply[j];
			if (!fulltextExpression.disabled && !arrayIncludes(appliedFulltext, synonym)) {
				const aSynonymFulltextQuery: QueryDsl = fulltext(
					fieldsArr,
					synonym,
					QUERY_OPERATOR_AND,
					fulltextBoost
				);
				synonymExpressions.push(aSynonymFulltextQuery);
				appliedFulltext.push(synonym);
			}
			if (!stemmedExpression.disabled && locale !== 'zxx') {
				const stemmingLanguage = stemmingLanguageFromLocale(locale);
				if (stemmingLanguage) {
					const aSynonymStemmedQuery: QueryDsl = stemmed(
						fieldsArr,
						synonym,
						stemmingLanguage as StemmingLanguageCode,
						QUERY_OPERATOR_AND,
						stemmedBoost
					);
					synonymExpressions.push(aSynonymStemmedQuery);
				} else {
					log.warning(`Unable to guess stemmingLanguage from locale:${locale}`);
				} // stemmingLanguage
			} // !zxx
		} // for synonymsToApply[j]
	} // for synonyms[i]

	if (synonymExpressions.length) {
		selectionExpressions.push(bool({
			boost: SYNOYMS_BOOST_MULTIPLIER,
			should: synonymExpressions,
		}));
	}

	if (!termQueries.length) {
		return bool(atLeastOneMustBeTrue(selectionExpressions));
	}

	const termExpressions = [];
	for (let i = 0; i < termQueries.length; i++) {
		const {
			booleanValue,
			boost,
			doubleValue,
			field,
			longValue,
			stringValue,
			type
		} = termQueries[i];
		const value = type === VALUE_TYPE_BOOLEAN
			? booleanValue
			: type === VALUE_TYPE_DOUBLE
				? doubleValue
				: type === VALUE_TYPE_LONG
					? longValue
					: stringValue;
		termExpressions.push(term(
			field,
			value,
			boost
		));
	} // for termQueries

	const nestedQuery = boostedQuery(selectionExpressions, termExpressions);

	if (_trace) log.debug('%s nestedQuery:%s', LOG_PREFIX, toStr(nestedQuery));
	return nestedQuery;
}
