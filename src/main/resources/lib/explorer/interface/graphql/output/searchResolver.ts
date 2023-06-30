import type {DocumentNode} from '/lib/explorer/types/index.d';
import type {
	Hit,
	Profiling,
	SearchResolverEnv,
	SearchResolverReturnType
} from '/lib/explorer/interface/graphql/output/index.d';


import {
	getIn,
	isSet,
	toStr
} from '@enonic/js-utils';
import {
	COLLECTION_REPO_PREFIX,
	FIELD_PATH_META,
	PRINCIPAL_EXPLORER_READ
} from '/lib/explorer/constants';
import {applyDocumentTypeToDocumentNode} from '/lib/explorer/_uncoupled/document/applyDocumentTypeToDocumentNode';
import {getDocumentTypeByName} from '/lib/explorer/documentType/getDocumentTypeByName';
import {connect} from '/lib/explorer/repo/connect';
import {multiConnect} from '/lib/explorer/repo/multiConnect';

// This fails when tsup code splitting: true
// import {currentTimeMillis} from '/lib/explorer/time/currentTimeMillis';

import {washDocumentNode} from '../utils/washDocumentNode';
import {makeQueryParams} from './makeQueryParams';
/*import {
	queryResHighlightObjToArray
} from '../highlight/output/queryResHighlightObjToArray';*/


//@ts-ignore
const {currentTimeMillis} = Java.type('java.lang.System') as {
	currentTimeMillis: () => number
}


const DEBUG = false;
const TRACE = false;


export function searchResolver(env: SearchResolverEnv): SearchResolverReturnType {
	//log.debug('searchResolver env:%s', toStr(env));
	const {
		args,
		args: {
			aggregations: aggregationsArg,
			count, // ?:number
			filters: filtersArg,
			highlight: highlightArg,
			languages: languagesArg,
			// query: queryArg,
			searchString: searchStringArg = '', // :string
			start = 0
		},
		context: {
			logQuery = false,
			logSynonymsQuery = false,
			logSynonymsQueryResult = false
		},
		// source = {} // Doesn't handle null!!!
	} = env; // avoid deconstrution error when source is null

	let {source} = env;
	if (!isSet(source)) { // handles null :)
		source = {};
	}
	//log.debug('searchResolver args:%s', toStr(args));
	//log.debug('searchResolver source:%s', toStr(source));
	//log.debug('searchResolver aggregationsArg:%s', toStr(aggregationsArg));
	//log.debug('searchResolver filtersArg:%s', toStr(filtersArg));
	//log.debug('searchResolver highlightArg:%s', toStr(highlightArg));
	//log.debug('searchResolver logQuery:%s', toStr(logQuery));

	const {
		profiling: profilingArraySource = []
	} = source;
	//log.debug('searchResolver profilingArraySource:%s', toStr(profilingArraySource));

	const {
		profiling: profilingArg = Array.isArray(profilingArraySource) && profilingArraySource.length ? true : false
	} = args;
	//log.debug('searchResolver profilingArg:%s', toStr(profilingArg));

	const {
		interfaceInfo,
		languages = languagesArg,
		searchString = searchStringArg,
		synonyms: synonymsSource
	} = source;

	const profiling: Profiling[] = [];
	if (profilingArg) {
		profiling.push({
			currentTimeMillis: currentTimeMillis(),
			label: 'search',
			operation: 'start'
		});
		//log.debug('profiling:%s', toStr(profiling));
	}

	const {
		collectionNameToId,
		fields,
		interfaceId,
		interfaceName,
		localesInSelectedThesauri,
		stopWords,
		stemmingLanguages,
		termQueries,
		thesauriNames
	} = interfaceInfo;
	DEBUG && log.debug('searchResolver interfaceName:%s searchString:%s', interfaceName, searchString);


	const collectionNames = Object.keys(collectionNameToId);
	if (!collectionNames.length) {
		// throw new Error(`interface:${interfaceName} has no collections!`);
		log.error(`interface:${interfaceName} has no collections, returing empty result!`);
		return {
			aggregationsAsJson: {},
			count: 0,
			hits: [],
			profiling,//: [],
			start,
			synonyms: [],
			total: 0
		}
	}

	const multiRepoReadConnectParams = {
		principals: [PRINCIPAL_EXPLORER_READ],
		sources: collectionNames.map((collectionName) => ({
			repoId: `${COLLECTION_REPO_PREFIX}${collectionName}`,
			branch: 'master', // NOTE Hardcoded
			principals: [PRINCIPAL_EXPLORER_READ]
		}))
	};
	if (logQuery) {
		log.info('searchResolver interfaceName:%s multiRepoReadConnectParams:%s', interfaceName, toStr(multiRepoReadConnectParams));
	}
	const multiRepoReadConnection = multiConnect(multiRepoReadConnectParams);

	const {
		queryParams,
		synonyms
	} = makeQueryParams({
		aggregationsArg,
		count,
		doProfiling: profilingArg,
		fields,
		filtersArg,
		highlightArg,
		interfaceId,
		languages,
		localesInSelectedThesauri,
		logSynonymsQuery,
		logSynonymsQueryResult,
		profilingArray: profiling,
		profilingLabel: 'search',
		// queryArg,
		searchString,
		start,
		stemmingLanguages,
		stopWords,
		synonymsSource,
		thesauriNames,
		termQueries,
	});
	if (profilingArg) {
		profiling.push({
			currentTimeMillis: currentTimeMillis(),
			label: 'search',
			operation: 'makeQueryParams'
		});
		//log.debug('profiling:%s', toStr(profiling));
	}
	if (logQuery) {
		log.info('searchResolver interfaceName:%s queryParams:%s', interfaceName, toStr(queryParams));
	}

	//@ts-ignore filters type supports array too
	const queryRes = multiRepoReadConnection.query(queryParams);
	// log.info('queryRes.hits:%s', toStr(queryRes.hits)); // Useful when explain is true

	if (profilingArg) {
		profiling.push({
			currentTimeMillis: currentTimeMillis(),
			label: 'search',
			operation: 'query'
		});
		//log.debug('profiling:%s', toStr(profiling));
	}
	TRACE && log.debug('searchResolver queryRes:%s', toStr(queryRes));
	//log.debug('searchResolver queryRes.aggregations:%s', toStr(queryRes.aggregations));

	const rv :SearchResolverReturnType = {
		aggregationsAsJson: queryRes.aggregations, // GraphQL automatically converts to JSON
		count: queryRes.count,
		hits: queryRes.hits.map(({
			branch,
			highlight: highlightObj,
			id,
			repoId,
			score
		}) => {
			const collectionName = repoId.replace(COLLECTION_REPO_PREFIX, '');
			const explorerRepoReadConnection = connect({
				branch,
				principals: [PRINCIPAL_EXPLORER_READ],
				repoId
			});
			const collectionNode = explorerRepoReadConnection.get<DocumentNode>(id);
			TRACE && log.debug('collectionNode:%s', toStr(collectionNode));

			const washedNode = washDocumentNode(collectionNode);
			TRACE && log.debug('washedNode:%s', toStr(washedNode));

			const documentTypeName = getIn<
				DocumentNode, keyof DocumentNode, DocumentNode[typeof FIELD_PATH_META]['documentType'], undefined
			>(collectionNode, [FIELD_PATH_META, 'documentType'], undefined);

			const documentType = getDocumentTypeByName({documentTypeName}); // TODO cache...

			const typedDocumentNode = applyDocumentTypeToDocumentNode({
				documentType,
				documentNode: washedNode
			});

			const hit :Hit = {
				...typedDocumentNode, // Needed for ... on DocumentType_...
				_collection: collectionName,
				_createdTime: getIn<
					DocumentNode,
					//[typeof FIELD_PATH_META, 'createdTime'] // not keyof DocumentNode
					keyof DocumentNode,
					//DocumentNode[typeof FIELD_PATH_META]['createdTime'], // string|Date
					string,
					undefined
				>(collectionNode, [FIELD_PATH_META, 'createdTime'], undefined),
				_documentType: documentTypeName,
				_highlight: highlightObj, //queryResHighlightObjToArray({highlightObj}),
				_json: typedDocumentNode, //washedNode,
				_modifiedTime: getIn<
					DocumentNode,
					//[typeof FIELD_PATH_META, 'modifiedTime'] // not keyof DocumentNode
					keyof DocumentNode,
					//DocumentNode[typeof FIELD_PATH_META]['modifiedTime'], // string|Date
					string,
					undefined
				>(collectionNode, [FIELD_PATH_META, 'modifiedTime'], undefined),
				_score: score
			}
			DEBUG && log.debug('hit:%s', toStr(hit));

			return hit;
		}),
		start, // Used by searchConnection
		synonyms,
		total: queryRes.total
	};
	if (profilingArg) {
		profiling.push({
			currentTimeMillis: currentTimeMillis(),
			label: 'search',
			operation: 'process search results'
		});
		rv.profiling = profiling;
		//log.debug('profiling:%s', toStr(profiling));
	}
	DEBUG && log.debug('rv:%s', toStr(rv));
	return rv
}
