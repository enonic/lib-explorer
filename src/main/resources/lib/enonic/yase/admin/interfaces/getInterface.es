import {connect} from '/lib/enonic/yase/repo/connect';


export function getInterface({
	connection = connect(),
	interfaceName,
	key = `/interfaces/${interfaceName}`
}) {
	return connection.get(key)
}
