import type {CreateParameterObject} from '/lib/explorer/_uncoupled/document/types.d';

import {create as pureTsCreate} from '/lib/explorer/_uncoupled/document/create';
import {javaBridge} from '../_coupling/javaBridge';


export function create(object :CreateParameterObject) {
	return pureTsCreate(object, javaBridge);
}
