import type {
	DocumentTypeFields,
	DocumentTypeFieldsObject
} from '@enonic-types/lib-explorer';

import { toStr } from '@enonic/js-utils/value/toStr';

import { applyDefaultsToField } from './applyDefaultsToField';
import { isFields } from './isFields';


export function fieldsArrayToObj(
	fields: DocumentTypeFields,
): DocumentTypeFieldsObject {
	if (!isFields(fields)) { // NOTE Allowing empty array
		throw new TypeError(`fieldsArrayToObj: fields not of type Fields! fields:${toStr(fields)}`);
	}

	const FIELDS_OBJ: DocumentTypeFieldsObject = {};

	for (let i = 0; i < fields.length; i++) {
		const field = applyDefaultsToField(fields[i]);
		const {name, ...rest} = field;
		FIELDS_OBJ[name] = rest;
	}

	return FIELDS_OBJ;
}
