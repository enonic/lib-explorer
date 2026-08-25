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
import type {InterfaceExpressions, TermQuery} from '@enonic-types/lib-explorer/Interface.d';
import type {GQL_InputType_Highlight} from '@enonic-types/lib-explorer/GraphQL.d';
import type { StemmingLanguageCode } from '@enonic/js-utils/types';


import {
	addQueryFilter,
	toStr,
} from '@enonic/js-utils';
import { includes as arrayIncludes } from '@enonic/js-utils/array/includes';
import { noNilsArray } from '@enonic/js-utils/array/noNilsArray';
import { includes as strIncludes } from '@enonic/js-utils/string/includes';
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
import { isNotNil } from '/lib/explorer/typeGuards/isNotNil';

import {
	type AggregationInput,
	createAggregation,
	createFilters
	// @ts-ignore
} from '/lib/guillotine/util/factory';
import {makeQueryAndSynonyms} from './makeQueryAndSynonyms';
import {highlightGQLArgToEnonicXPQuery} from '/lib/explorer/interface/graphql/highlight/input/highlightGQLArgToEnonicXPQuery';
import {resolveFieldShortcuts} from './resolveFieldShortcuts';


interface MakeQueryParamsParams {
	_trace?: boolean;
	aggregationsArg: AnyObject[];
	doProfiling?: boolean;
	expressions?: InterfaceExpressions;
	explainArg?: boolean;
	fields: InterfaceField[];
	filtersArg?: AnyObject[];
	highlightArg?: GQL_InputType_Highlight;
	interfaceId: string;
	languages: string[];
	localesInSelectedThesauri: string[];
	profilingArray?: Profiling[];
	profilingLabel?: string;
	searchString: string;
	stopWords: string[];
	synonymsSource: SynonymsArray;
	thesauriNames: string[];
	// Optional
	count?: number;
	logSynonymsQuery?: boolean;
	logSynonymsQueryResult?: boolean;
	sort?: FieldSortDsl[];
	start?: number;
	stemmingLanguages?: StemmingLanguageCode[];
	termQueries?: TermQuery[];
}

interface MakeQueryParamsReturnValue {
	decoratedSearchString: string; // Can be ''
	queryParams: QueryNodeParams<Aggregations>;
	synonyms: SynonymsArray;
}

const TRACE = false;


export function makeQueryParams({
	_trace = TRACE,
	aggregationsArg,
	explainArg,
	expressions,
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
}: MakeQueryParamsParams): MakeQueryParamsReturnValue {
	if (_trace) log.debug('makeQueryParams highlightArg:%s', toStr(highlightArg));

	const aggregations = {};
	if (aggregationsArg) {
		if (_trace) log.debug('makeQueryParams aggregationsArg:%s', toStr(aggregationsArg));
		noNilsArray(resolveFieldShortcuts({
			basicObject: aggregationsArg
		})).forEach(aggregation => {
			// This works magically because fieldType is an Enum.
			createAggregation(aggregations, aggregation as AggregationInput);
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

	let filtersArray: Filter[];
	if (filtersArg) {
		// This works magically because fieldType is an Enum?
		filtersArray = createFilters(resolveFieldShortcuts({
			basicObject: filtersArg
		}) as unknown as AnyObject[]); // filtersArg is an array, so the JSON deref in resolveFieldShortcuts returns an array
		if (_trace) log.debug('filtersArray:%s', toStr(filtersArray));
		for (const staticFilter of staticFilters) {
			(filtersArray as Filter[]).push(staticFilter);
		}
		if (_trace) log.debug('filtersArray:%s', toStr(filtersArray));
	} else {
		filtersArray = staticFilters;
	}

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
					// For a very small positive impact: The smallest practical boost you should
					// use is something like 0.01 or 0.001. Because scores are logarithmic,
					// the difference between 0.001 and 0.0000001 is entirely negligible in final
					// rankings.
					// When logging the smallest I can see is 0.000000000000000001 (18 decimals)
					//
					// HOWEVER: I have tested what happens if one uses a boost of 0.
					// Even if the searchString is only present in that field, not even in _alltext.
					// One will get a hit with highlight, but the field will have no impact on the
					// score. Just because one wants a highlight from a field doesn't automatically
					// mean that that field is relevant in terms of scoring. So, zero is the way to
				// go. Can be overridden by adding a field boost in the Interface GUI.
					boost: 0,
					name: field,
				});
			}
		}
		if (_trace) log.debug('fieldsAndHighlight:%s', toStr(fieldsAndHighlight));
	}

	const {
		query,
		synonyms,
	} = makeQueryAndSynonyms({
		doProfiling,
		explorerRepoReadConnection,
		expressions,
		fields: fieldsAndHighlight || fields,
		interfaceId,
		languages,
		localesInSelectedThesauri,
		logSynonymsQuery,
		logSynonymsQueryResult,
		profilingArray,
		profilingLabel,
		searchStringWithoutStopWords,
		stemmingLanguages,
		synonymsSource,
		termQueries,
		thesauriNames,
	});

	const rv: MakeQueryParamsReturnValue = {
		decoratedSearchString: searchStringWithoutStopWords,
		queryParams: {
			aggregations,
			count,
			filters: filtersArray,
			query,
			sort,
			start
		},
		synonyms
	};

	if (isNotNil(explainArg)) rv.queryParams.explain = explainArg;

	if (isNotNil(highlightArg)) {
		rv.queryParams.highlight = highlightGQLArgToEnonicXPQuery({ highlightArg });
	}

	return rv;
}
