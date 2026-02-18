import type {
	ModifiedNode,
	RepoConnection as WriteConnection,
} from '/lib/xp/node';
import type {
	InputTypeSynonymLanguages,
	SynonymNode,
	SynonymNodeModifyParams
} from '../types.d';


import {
	forceArray,
	// toStr,
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
}: {
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
}: {
	// Required
	explorerRepoWriteConnection: WriteConnection
	// Optional
	checkInterfaceIds?: boolean
	interfaceIdsChecked?: Record<string,boolean>
	refreshRepoIndexes?: boolean
}) {
	const modifyRes = explorerRepoWriteConnection.modify<SynonymNodeModifyParams>({
		key: _id,
		editor: (originalNode) => {
			// log.debug('originalNode:%s', toStr(originalNode));
			if (originalNode._nodeType !== NT_SYNONYM) {
				log.error(`Node with _id:${_id} is not a synonym, but rather _nodeType:${originalNode._nodeType}`);
				throw new Error(`Node with _id:${_id} is not a synonym!`);
			}
			const modifiedNode: ModifiedNode<SynonymNodeModifyParams> = originalNode;
			modifiedNode.comment = commentArg;
			modifiedNode.disabledInInterfaces = checkInterfaceIds
				? getValidInterfaceIds({
					explorerRepoReadConnection: explorerRepoWriteConnection,
					interfaceIdsArray: disabledInInterfacesArg,
					interfaceIdsChecked // modified within
				}).map((validInterfaceId) => referenceValue(validInterfaceId))
				: disabledInInterfacesArg
					? forceArray(disabledInInterfacesArg).map((uncheckedInterfaceId) => referenceValue(uncheckedInterfaceId))
					: [];
					modifiedNode.enabled = enabledArg;
					modifiedNode.languages = moldInputTypeLanguages({
				checkInterfaceIds,
				explorerRepoReadConnection: explorerRepoWriteConnection,
				interfaceIdsChecked,
				languagesArg,
			});
			// modifiedNode.nodeTypeVersion = 2;
			modifiedNode.modifiedTime = new Date();
			modifiedNode.modifier = getUser().key;
			modifiedNode._indexConfig = buildSynonymIndexConfig({
				partialSynonymNode: modifiedNode
			});
			// log.debug('modifiedNode:%s', toStr(modifiedNode));
			return modifiedNode;
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
