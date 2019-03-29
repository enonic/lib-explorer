//import {toStr} from '/lib/enonic/util';
import {response as newResponse} from '/lib/enonic/yase/nodeTypes/response';
import {createOrModify} from '/lib/enonic/yase/node/createOrModify';


export const persistResponse = ({
	__repoId,
	_parentPath = '/',
	_name,
	request,
	response
}) => {
	//log.info(toStr({__repoId}));
	//log.info(toStr({__repoId, _parentPath, _name, request, response}));
	const params = newResponse({
		__repoId,
		_parentPath,
		_name,
		request,
		response
	});
	//log.info(toStr({params}));
	return createOrModify(params);
} // persistResponse
