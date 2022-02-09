import type {UpdateParameterObject} from '/lib/explorer-typescript/document/types';

import {createOrUpdate as pureTsCreateOrUpdate} from '/lib/explorer-typescript/document/createOrUpdate';
import {javaBridge} from './javaBridge';


export function createOrUpdate(object :UpdateParameterObject) {
	return pureTsCreateOrUpdate(object, javaBridge);
}
