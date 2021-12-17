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
import {toStr} from '@enonic/js-utils/dist/esm/index.mjs';

import {logDummy} from './dummies';
import {validateOccurrences} from './validateOccurrences';


interface LooseObject {
	[key :string] :unknown
}

interface Field {
	readonly active :boolean
	readonly enabled :boolean
	readonly fulltext :boolean
	readonly includeInAllText :boolean
	readonly max? :number
	readonly min? :number
	readonly name :string
	readonly nGram :boolean
	readonly path :boolean
	readonly valueType? :string
}

interface ValidateParameters {
	readonly data :LooseObject
	readonly fields :Field[]
	readonly validateOccurrences? :boolean
	readonly validateTypes? :boolean
	//documentType? :LooseObject
}


export function validate({
	data,
	fields,
	validateOccurrences: boolValidateOccurrences = false,
	validateTypes: boolValidateTypes = true
}: ValidateParameters, {
	log = logDummy
} = {}) {
	//log.debug(`data:${toStr(data)}`);
	//log.debug(`fields:${toStr(fields)}`);
	//log.debug(`boolValidateOccurrences:${toStr(boolValidateOccurrences)}`);
	log.debug(`boolValidateTypes:${toStr(boolValidateTypes)}`);
	if (boolValidateOccurrences) {
		if (!validateOccurrences({ data, fields }, { log })) {
			return false;
		}
	}
	return true;
}
