import {
	forceArray//,
	//toStr
} from '@enonic/js-utils';


export function referencedBy({
	_id,
	boolGetNode = false,
	connection, // Connecting many places leeds to loss of control over principals, so pass in connection
	count = -1,
	start
}) {
	const queryParams = {
		count,
		query: `_references = '${_id}'`,
		start
	};
	//log.debug(`queryParams:${toStr(queryParams)}`);

	const queryRes = connection.query(queryParams);
	//log.debug(`queryRes:${toStr(queryRes)}`);

	const nodes = connection.get(queryRes.hits.map(({id}) => id));
	//log.debug(`nodes:${toStr(nodes)}`);

	if (boolGetNode) {
		const nodesObj = {};
		forceArray(nodes).forEach(({
			_id,
			...rest
		}) => {
			nodesObj[_id] = rest;
		});
		//log.debug(`nodesObj:${toStr(nodesObj)}`);

		queryRes.hits = queryRes.hits.map(({
			id,
			score
		}) => ({
			...nodesObj[id],
			_id: id,
			_score: score
		}));
	} // boolGetNode

	return queryRes;
}
