//import {toStr} from '@enonic/js-utils';

import {get as getNode} from '/lib/explorer/node/get';


export function get({
	connection
}) {
	const node = getNode({
		connection,
		_name: '' // The repo root node
	});
	//log.info(toStr({node}));
	const {should, state} = node;
	//log.info(toStr({should, state}));
	return {should, state};
}
