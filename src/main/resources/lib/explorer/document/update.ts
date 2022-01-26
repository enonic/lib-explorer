import type {UpdateParameterObject} from '../../../../typeScript/lib/explorer/document/types';

import {update as pureTsUpdate} from '../../../../typeScript/lib/explorer/document/update';
import {javaBridge} from './javaBridge';


export function update(object :UpdateParameterObject) {
	return pureTsUpdate(object, javaBridge);
}
