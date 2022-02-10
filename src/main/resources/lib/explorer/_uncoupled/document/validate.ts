//──────────────────────────────────────────────────────────────────────────────
//
// There are multiple things that can be validated:
// * That defined fields have correct occurences (covers required)
// * That defined fields have correct type
// * That there are no extra/undefined fields
//
// Since Collectors and Document REST are not allowed to write global fields, we
// only need to validate the DocumentType.
//
//──────────────────────────────────────────────────────────────────────────────
import type {JavaBridge} from '../../_coupling/types.d';
import type {ValidateParameters} from './types.d';


import {toStr} from '@enonic/js-utils/dist/esm/index.mjs';

import {javaBridgeDummy} from '../dummies';
import {fieldsObjToArray} from './field';
import {validateOccurrences} from './validateOccurrences';
import {validateTypes} from './validateTypes';


export function validate(
	{
		data,
		fieldsObj,
		partial = false,
		validateOccurrences: boolValidateOccurrences = false,
		validateTypes: boolValidateTypes = true
	}: ValidateParameters,
	javaBridge :JavaBridge = javaBridgeDummy
) {
	//const {log} = javaBridge;
	//log.debug(`data:${toStr(data)}`);
	//log.debug(`fields:${toStr(fields)}`);
	//log.debug(`boolValidateOccurrences:${toStr(boolValidateOccurrences)}`);
	const fields = fieldsObjToArray(fieldsObj);

	if (boolValidateOccurrences) {
		if (!validateOccurrences({ data, fields, partial }, javaBridge)) {
			return false;
		}
	}
	//log.debug(`boolValidateTypes:${toStr(boolValidateTypes)}`);
	if (boolValidateTypes) {
		return validateTypes({ data, fields }, javaBridge);
	}
	return true;
}
