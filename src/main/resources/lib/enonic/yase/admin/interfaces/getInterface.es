import {connectRepo} from '/lib/enonic/yase/connectRepo';


export function getInterface({
	connection = connectRepo(),
	interfaceName,
	key = `/interfaces/${interfaceName}`
}) {
	return connection.get(key)
}
