import type {CreateParameterObject} from '/lib/explorer-typescript/document/types';

import {create as pureTsCreate} from '/lib/explorer-typescript/document/create';
import {javaBridge} from './javaBridge';


export function create(object :CreateParameterObject) {
	return pureTsCreate(object, javaBridge);
}
