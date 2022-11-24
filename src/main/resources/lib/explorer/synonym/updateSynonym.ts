import type {RepoConnection as WriteConnection} from '/lib/xp/node';
import type {SynonymNode} from '/lib/explorer/types/';
import type {
	InputTypeSynonymLanguages,
	SynonymNodeModifyParams
} from '/lib/explorer/types/Synonym';


import {
	forceArray//,
	//toStr
} from '@enonic/js-utils';
import {NT_SYNONYM} from '/lib/explorer/constants';
import {buildSynonymIndexConfig} from '/lib/explorer/synonym/buildSynonymIndexConfig';
import {moldSynonymNode} from '/lib/explorer/synonym/moldSynonymNode';
import {
	getValidInterfaceIds,
	moldInputTypeLanguages
} from '/lib/explorer/synonym/createSynonym';
import {getUser} from '/lib/xp/auth';
import {reference as referenceValue} from '/lib/xp/value';


export function updateSynonym({
	// Required
	_id,
	// Optional
	comment: commentArg = '',
	disabledInInterfaces: disabledInInterfacesArg = [],
	enabled: enabledArg = true,
	languages: languagesArg = []
} :{
	// Required
	_id: string
	// Optional
	comment?: string
	disabledInInterfaces?: string[]
	enabled?: boolean
	languages?: InputTypeSynonymLanguages
}, {
	// Required
	explorerRepoWriteConnection,
	// Optional
	checkInterfaceIds = false,
	interfaceIdsChecked = {}, // modified within
	refreshRepoIndexes = true // Set to false when bulk importing...
} :{
	// Required
	explorerRepoWriteConnection: WriteConnection
	// Optional
	checkInterfaceIds?: boolean
	interfaceIdsChecked?: Record<string,boolean>
	refreshRepoIndexes?: boolean
}) {
	const modifyRes = explorerRepoWriteConnection.modify<SynonymNodeModifyParams>({
		key: _id,
		editor: (node) => {
			//log.debug(`node:${toStr(node)}`);
			if (node._nodeType !== NT_SYNONYM) {
				log.error(`Node with _id:${_id} is not a synonym, but rather _nodeType:${node._nodeType}`);
				throw new Error(`Node with _id:${_id} is not a synonym!`);
			}
			node.comment = commentArg;
			node.disabledInInterfaces = checkInterfaceIds
				? getValidInterfaceIds({
					explorerRepoReadConnection: explorerRepoWriteConnection,
					interfaceIdsArray: disabledInInterfacesArg,
					interfaceIdsChecked // modified within
				}).map((validInterfaceId) => referenceValue(validInterfaceId))
				: disabledInInterfacesArg
					? forceArray(disabledInInterfacesArg).map((uncheckedInterfaceId) => referenceValue(uncheckedInterfaceId))
					: [];
			node.enabled = enabledArg;
			node.languages = moldInputTypeLanguages({
				checkInterfaceIds,
				explorerRepoReadConnection: explorerRepoWriteConnection,
				interfaceIdsChecked,
				languagesArg,
			});
			//node.nodeTypeVersion = 2;
			node.modifiedTime = new Date();
			node.modifier = getUser().key;
			node._indexConfig = buildSynonymIndexConfig({
				partialSynonymNode: node
			});
			//log.debug(`node:${toStr(node)}`);
			return node;
		}
	}) as unknown as SynonymNode;
	if (!modifyRes) {
		throw new Error(`Something went wrong when trying to modify synonym _id:${_id}!`);
	}
	if (refreshRepoIndexes) {
		explorerRepoWriteConnection.refresh();
	}
	return moldSynonymNode(modifyRes);
}
