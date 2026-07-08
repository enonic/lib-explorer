import type {QueryDsl} from '/lib/xp/node';
import type {InterfaceField} from '@enonic-types/lib-explorer';
import type {TermQuery} from '@enonic-types/lib-explorer/Interface.d';
import type { StemmingLanguageCode } from '@enonic/js-utils/types';


import {
	VALUE_TYPE_BOOLEAN,
	VALUE_TYPE_DOUBLE,
	VALUE_TYPE_LONG,
	// VALUE_TYPE_STRING,
	QUERY_OPERATOR_AND,
	storage,
	// toStr,
} from '@enonic/js-utils';
import { quoteWordsWithNumbers } from '/lib/explorer/query/quoteWordsWithNumbers';
import { toStr } from '@enonic/js-utils/value/toStr';

const TRACE = false;
const LOG_PREFIX = 'makeQuery:';

const bool = storage.query.dsl.bool;
const fulltext = storage.query.dsl.fulltext;
const all = storage.query.dsl.must;
const ngram = storage.query.dsl.ngram;
const some = storage.query.dsl.should;
const stemmed = storage.query.dsl.stemmed;
const term = storage.query.dsl.term;


export function makeQuery({
	_trace = TRACE,
	fields,
	searchStringWithoutStopWords,
	// Optional
	stemmingLanguages = [],
	termQueries = [],
}: {
	_trace?: boolean;
	fields: InterfaceField[]
	searchStringWithoutStopWords: string
	// Optional
	stemmingLanguages?: StemmingLanguageCode[]
	termQueries?: TermQuery[]
}) {
	const fieldsArr = fields.map(({boost, name: field}) => ({boost, field}));
	if (!fieldsArr.filter(({field}) => field === '_alltext').length) {
		fieldsArr.push({
			boost: 1,
			field: '_alltext'
		})
	}
	if (_trace) log.debug('%s fieldsArr:%s', LOG_PREFIX, toStr(fieldsArr));

	const maybeQuotedWords = quoteWordsWithNumbers(searchStringWithoutStopWords);

	const arr: Array<ReturnType<typeof fulltext | typeof stemmed | typeof ngram | typeof term>> = [fulltext(
		// fields.map(({boost, name: field}) => ({boost: (
		// 	parseInt(boost as unknown as string) // In case there are some old interface nodes with boost as string rather than number
		// 	||1) + (fields.length * 2), field})),
		fieldsArr,
		maybeQuotedWords,
		QUERY_OPERATOR_AND,
		1
	)];

	for (let i = 0; i < stemmingLanguages.length; i++) {
		const stemmingLanguage = stemmingLanguages[i];
		arr.push(stemmed(
			// fields.map(({boost, name: field}) => ({boost: (
			// 	parseInt(boost as unknown as string) // In case there are some old interface nodes with boost as string rather than number
			// 	||1) + fields.length, field})),
			fieldsArr,
			maybeQuotedWords,
			QUERY_OPERATOR_AND,
			stemmingLanguage,
			0.9
		));
	}

	arr.push(ngram(
		fieldsArr,
		maybeQuotedWords,
		QUERY_OPERATOR_AND,
		0.8
	));

	const mainQuery = bool(some(arr)) as QueryDsl;
	if (_trace) log.debug('%s mainQuery:%s', LOG_PREFIX, toStr(mainQuery));

	if (!termQueries.length) {
		return mainQuery;
	}

	const expressions = [];
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
					: stringValue
					expressions.push(term(
			field,
			value,
			boost
		));
	}

	// A: normal results
	// B: everything with source:specific
	// A || B would give too much results (stuff outside A)
	// A && B would give too few results (exclude everything without source:specific)
	// A || (A && B) is the way to go.
	const nestedQuery = bool(some(
		mainQuery,
		bool(all(
			mainQuery,
			bool(some(expressions))
		))
	)) as QueryDsl;
	if (_trace) log.debug('%s nestedQuery:%s', LOG_PREFIX, toStr(nestedQuery));
	return nestedQuery;
}
