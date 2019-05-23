import {join} from '/lib/explorer/path/join';


export function dirname(path) {
	return join(path, '..');
}
