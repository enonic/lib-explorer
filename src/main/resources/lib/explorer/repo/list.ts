import type {ListParams} from '/lib/explorer/_uncoupled/repo/list';

import {javaBridge} from '/lib/explorer/_coupling/javaBridge';
import {list as pureTsList} from '/lib/explorer/_uncoupled/repo/list';


export function list(object :ListParams) {
	return pureTsList(object, javaBridge);
}
