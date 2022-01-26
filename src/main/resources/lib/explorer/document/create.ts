import type {CreateParameterObject} from '../../../../typeScript/lib/explorer/document/types';

import {create as pureTsCreate} from '../../../../typeScript/lib/explorer/document/create';
import {javaBridge} from './javaBridge';


export function create(object :CreateParameterObject) {
	return pureTsCreate(object, javaBridge);
}
