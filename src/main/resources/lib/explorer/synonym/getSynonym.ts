import type {
	RepoConnection,
	SynonymNode
} from '/lib/explorer/types/index.d';


import {NT_SYNONYM} from '/lib/explorer/constants';
import {moldSynonymNode} from '/lib/explorer/synonym/moldSynonymNode';


export function getSynonym({
	explorerRepoReadConnection, // Connecting many places leeds to loss of control over principals, so pass a connection around.
	_id
} :{
	explorerRepoReadConnection :RepoConnection
	_id :string
}) {
	const node = explorerRepoReadConnection.get(_id);
	if (!node) {
		throw new Error(`Couldn't find node with _id:${_id}`);
	}
	const {_nodeType} = node;
	if (_nodeType !== NT_SYNONYM) {
		log.error(`Node with _id:${_id} is not a synonym, but rather _nodeType:${_nodeType}`);
		throw new Error(`Node with _id:${_id} is not a synonym!`);
	}
	return moldSynonymNode(node as SynonymNode);
}
