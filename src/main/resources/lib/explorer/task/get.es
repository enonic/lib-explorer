import {get as getNode} from '/lib/explorer/node/get';


export function get({
	connection
}) {
	const node = getNode({
		connection,
		_name: '' // The repo root node
	});
	const {should, state} = node;
	return {should, state};
}
