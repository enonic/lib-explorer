import type {UpdateParameterObject} from '/lib/explorer-typescript/document/types';

import {update as pureTsUpdate} from '/lib/explorer-typescript/document/update';
import {javaBridge} from './javaBridge';


export function update(object :UpdateParameterObject) {
	return pureTsUpdate(object, javaBridge);
}
