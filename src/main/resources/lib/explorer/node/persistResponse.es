//import {toStr} from '/lib/util';
import {response as newResponse} from '/lib/explorer/nodeTypes/response';
import {createOrModify} from '/lib/explorer/node/createOrModify';


export const persistResponse = ({
	__connection,
	_parentPath = '/',
	_name,
	request,
	response
}) => {
	//log.info(toStr({__repoId}));
	//log.info(toStr({__repoId, _parentPath, _name, request, response}));
	const params = newResponse({
		__connection,
		_parentPath,
		_name,
		request,
		response
	});
	//log.info(toStr({params}));
	return createOrModify(params);
} // persistResponse