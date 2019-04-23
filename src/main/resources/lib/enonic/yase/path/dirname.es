import {join} from '/lib/enonic/yase/path/join';


export function dirname(path) {
	return join(path, '..');
}
