import type {UpdateParameterObject} from '../../../../typeScript/lib/explorer/document/types';

import {createOrUpdate as pureTsCreateOrUpdate} from '../../../../typeScript/lib/explorer/document/createOrUpdate';
import {javaBridge} from './javaBridge';


export function createOrUpdate(object :UpdateParameterObject) {
	return pureTsCreateOrUpdate(object, javaBridge);
}
