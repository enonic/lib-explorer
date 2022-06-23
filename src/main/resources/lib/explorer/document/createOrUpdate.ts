import type {UpdateParameterObject} from '/lib/explorer/_uncoupled/document/types.d';

import {createOrUpdate as pureTsCreateOrUpdate} from '/lib/explorer/_uncoupled/document/createOrUpdate';
import {javaBridge} from '../_coupling/javaBridge';


export function createOrUpdate(object :UpdateParameterObject) {
	return pureTsCreateOrUpdate(object, javaBridge);
}
