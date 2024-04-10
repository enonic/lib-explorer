import type {
	CollectorStateData,
	RepoConnection
} from '@enonic-types/lib-explorer';


// import { toStr } from '@enonic/js-utils';
import {get as getNode} from '/lib/explorer/node/get';


export function get({
	connection
}: {
	connection: RepoConnection
}) {
	const node = getNode<CollectorStateData>({
		connection,
		_name: '' // The repo root node
	});
	//log.info(toStr({node}));
	const {should, state} = node as CollectorStateData;
	//log.info(toStr({should, state}));
	return {should, state};
}
