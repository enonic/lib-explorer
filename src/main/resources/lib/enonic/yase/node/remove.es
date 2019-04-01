import {connect} from '/lib/enonic/yase/repo/connect';


export function remove({
	repoId,
	branch = 'master',
	_parentPath = '/',
	_name,
	path = `${_parentPath}${_name}`,
	key = path,
	keys = [key]
}) {
	const connection = connect({
		repoId,
		branch
	});
	return connection.delete(keys); // Array
}
