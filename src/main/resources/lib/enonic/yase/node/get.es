import {connect} from '/lib/enonic/yase/repo/connect';


export const get = ({
	repoId,
	branch = 'master',
	_parentPath = '/',
	_name,
	path = `${_parentPath}${_name}`,
	key = path,
	keys = [key]
}) => {
	const connection = connect({
		repoId,
		branch
	});
	return connection.get(...keys);
} // get
