//import {toStr} from '@enonic/js-utils';


export function referencedBy({
	_id,
	connection,
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

	return queryRes;
}
