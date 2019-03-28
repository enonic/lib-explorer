import {connect} from '/lib/enonic/yase/repo/connect';
import {response as newResponse} from '/lib/enonic/yase/nodeTypes/response';
import {createOrModify} from '/lib/enonic/yase/node/createOrModify';


export const persistResponse = ({
	__repoid,
	__connection = connect({repoId}),
	_parentPath = '/',
	_name,
	request,
	response
}) => {
	return createOrModify(newResponse({
		_parentPath,
		_name,
		request,
		response
	}));
} // persistResponse
