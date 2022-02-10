import type {UpdateParameterObject} from '/lib/explorer/_uncoupled/document/types';

import {update as pureTsUpdate} from '/lib/explorer/_uncoupled/document/update';
import {javaBridge} from '../_coupling/javaBridge';


export function update(object :UpdateParameterObject) {
	return pureTsUpdate(object, javaBridge);
}
