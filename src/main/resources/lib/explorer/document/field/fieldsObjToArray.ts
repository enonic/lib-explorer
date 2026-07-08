import type {
	DocumentTypeFields,
	DocumentTypeFieldsObject
} from '@enonic-types/lib-explorer';

import { applyDefaultsToField } from './applyDefaultsToField';

export function fieldsObjToArray(
	fieldsObj: DocumentTypeFieldsObject,
): DocumentTypeFields {
	return Object.keys(fieldsObj).map(pathString => ({
		...applyDefaultsToField(fieldsObj[pathString]),
		name: pathString
	}));
}
