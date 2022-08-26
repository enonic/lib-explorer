import type {DocumentNode} from '/lib/explorer/types/index.d';
import type {
	Hit,
	SearchResolverEnv,
	SearchResolverReturnType
} from './index.d';


import {
	getIn,
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
import {washDocumentNode} from '../utils/washDocumentNode';
import {getInterfaceInfo} from './getInterfaceInfo';
import {makeQueryParams} from './makeQueryParams';
/*import {
	queryResHighlightObjToArray
} from '../highlight/output/queryResHighlightObjToArray';*/


const DEBUG = false;
const TRACE = false;


export function searchResolver({
	args: {
		aggregations: aggregationsArg,
		count, // ?:number
		filters: filtersArg,
		highlight: highlightArg,
		languages,
		searchString = '', // :string
		start = 0
	},
	context: {
		interfaceName,
		logQuery = false,
		logSynonymsQuery = false
	}
} :SearchResolverEnv) :SearchResolverReturnType {
	//log.debug('searchResolver aggregationsArg:%s', toStr(aggregationsArg));
	//log.debug('searchResolver filtersArg:%s', toStr(filtersArg));
	//log.debug('searchResolver highlightArg:%s', toStr(highlightArg));
	//log.debug('searchResolver logQuery:%s', toStr(logQuery));
	DEBUG && log.debug('searchResolver interfaceName:%s searchString:%s', interfaceName, searchString);

	const {
		collectionNameToId,
		fields,
		interfaceId,
		localesInSelectedThesauri,
		stopWords,
		thesauriNames
	} = getInterfaceInfo({
		interfaceName
	});
	const multiRepoReadConnection = multiConnect({
		principals: [PRINCIPAL_EXPLORER_READ],
		sources: Object.keys(collectionNameToId).map((collectionName) => ({
			repoId: `${COLLECTION_REPO_PREFIX}${collectionName}`,
			branch: 'master', // NOTE Hardcoded
			principals: [PRINCIPAL_EXPLORER_READ]
		}))
	});

	const {
		queryParams,
		synonyms
	} = makeQueryParams({
		aggregationsArg,
		count,
		fields,
		filtersArg,
		highlightArg,
		interfaceId,
		languages,
		localesInSelectedThesauri,
		logSynonymsQuery,
		searchString,
		start,
		stopWords,
		thesauriNames,
	});
	if (logQuery) {
		log.info('searchResolver interfaceName:%s queryParams:%s', interfaceName, toStr(queryParams));
	}

	//@ts-ignore filters type supports array too
	const queryRes = multiRepoReadConnection.query(queryParams);
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
	DEBUG && log.debug('rv:%s', toStr(rv));
	return rv
}
