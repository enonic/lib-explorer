import type {QueryDsl} from '/lib/xp/node';
import type {InterfaceField} from '/lib/explorer/types/index.d';


import {
	QUERY_OPERATOR_AND,
	storage
} from '@enonic/js-utils';


const bool = storage.query.dsl.bool;
const fulltext = storage.query.dsl.fulltext;
const ngram = storage.query.dsl.ngram;
const or = storage.query.dsl.or;
const stemmed = storage.query.dsl.stemmed;


export function makeQuery({
	fields,
	searchStringWithoutStopWords,
	// Optional
	stemmingLanguages = []
} :{
	fields :Array<InterfaceField>
	searchStringWithoutStopWords :string
	// Optional
	stemmingLanguages ?:Array<string>
}) {
	const arr :Array<ReturnType<typeof fulltext | typeof stemmed | typeof ngram>> = [fulltext(
		fields.map(({boost, name: field}) => ({boost: (
			parseInt(boost as unknown as string) // In case there are some old interface nodes with boost as string rather than number
			||1) + (fields.length * 2), field})),
		searchStringWithoutStopWords,
		QUERY_OPERATOR_AND
	)];

	for (let i = 0; i < stemmingLanguages.length; i++) {
		const stemmingLanguage = stemmingLanguages[i];
		arr.push(stemmed(
			fields.map(({boost, name: field}) => ({boost: (
				parseInt(boost as unknown as string) // In case there are some old interface nodes with boost as string rather than number
				||1) + fields.length, field})),
			searchStringWithoutStopWords,
			QUERY_OPERATOR_AND,
			stemmingLanguage
		));
	}

	arr.push(ngram(
		fields.map(({boost, name: field}) => ({boost, field})),
		searchStringWithoutStopWords,
		QUERY_OPERATOR_AND
	));

	const query = bool(or(arr));
	return query as QueryDsl;
}
