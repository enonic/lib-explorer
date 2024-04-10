import type {RepoConnection} from '/lib/xp/node';
import type {
	CollectionNode,
	CollectionNodeSpecific,
	OneOrMore,
} from '@enonic-types/lib-explorer';


import {forceArray} from '@enonic/js-utils';
import {NT_COLLECTION} from '/lib/explorer/constants'


const PATH_COLLECTIONS = '/collections/';


export const get = ({
	connection, // Connecting many places leeds to loss of control over principals, so pass a connection around.
	//debug = false,
	name,
	key = `${PATH_COLLECTIONS}${name}`,
	keys = Array.isArray(name)
		? name.map(n => `${PATH_COLLECTIONS}${n}`)
		: key
} :{
	connection: RepoConnection,
	name?: string,
	key?: string,
	keys?: OneOrMore<string>
}) => {
	//if (debug) { log.debug(`keys:${toStr({keys})}`); }
	const res = connection.get<CollectionNodeSpecific>(keys) as OneOrMore<CollectionNode>;
	//if (debug) { log.debug(`res:${toStr({res})}`); }

	// NOTE: Can't throw on !res, because this function is used by ./exists.ts
	// TODO: try/catch in ./exists.ts and throw on undefined here?
	if (res) {
		const array = forceArray(res);
		for (let i = 0; i < array.length; i++) {
			const node = array[i];
			if (node && node._nodeType !== NT_COLLECTION) {
				log.error(`collection.get: node with _id:${node._id} _path:${node._path} is not a collection, but _nodeType:${node._nodeType}!`);
				throw new Error(`collection.get: node with _id:${node._id} is not a collection!`);
			}
		}
	}
	return res;
};
