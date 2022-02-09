//import type {Path} from '/lib/explorer-typescript/types.d';
import {join} from '/lib/explorer/path/join';


export function dirname(path) {
	return join(path, '..');
}
