import type { RepoConnection } from '@enonic-types/lib-node';
import type { CollectorStateData } from '../types/Collector.d';

// import { toStr } from '@enonic/js-utils';
import { get as getNode } from '/lib/explorer/node/get';

export interface GetTaskParams {
	connection: RepoConnection;
}

export function get({ connection }: GetTaskParams) {
	const node = getNode<CollectorStateData>({
		connection,
		_name: '' // The repo root node
	});
	// log.info(toStr({ node }));
	const { should, state } = node as CollectorStateData;
	// log.info(toStr({ should, state }));
	return { should, state };
}
