import type { DocumentTypeFields } from '@enonic-types/lib-explorer';


import { VALUE_TYPE_SET } from '@enonic/js-utils';
import { includes as stringIncludes } from '@enonic/js-utils/string/includes';
import { toStr } from '@enonic/js-utils/value/toStr';

import { applyDefaultsToField } from './applyDefaultsToField';
import { fieldsArrayToObj } from './fieldsArrayToObj';
import { isFields } from './isFields';


const TRACE = false;
const LOG_PREFIX = 'addMissingSetToFieldsArray()';

export function addMissingSetToFieldsArray(
	fields: DocumentTypeFields,
	{ _trace = TRACE } = {},
): DocumentTypeFields {
	if (!isFields(fields)) { // NOTE Allowing empty array
		throw new TypeError(`addMissingSetToFields: fields not of type Fields! fields:${toStr(fields)}`);
	}

	const returnFields: DocumentTypeFields = JSON.parse(JSON.stringify(fields));

	const fieldsObj = fieldsArrayToObj(fields);

	for (let i = 0; i < fields.length; i++) {
		const field = fields[i];
		let {name: path} = field;
		if (TRACE) log.debug(`path:${path}`);
		while (stringIncludes(path, '.')) {
			path = path.split('.').slice(0,-1).join('.');
			if (TRACE) log.debug(`path:${path}`);
			if (!fieldsObj[path]) {
				if (TRACE) log.debug(`Adding missing set at path:${path}`);
				returnFields.push(applyDefaultsToField({
					name: path,
					valueType: VALUE_TYPE_SET
				}));
			}
		}
	}
	if (_trace) log.debug('%s returnFields:%s', LOG_PREFIX, toStr(returnFields));

	returnFields.sort(({name: nameA},{name: nameB}) => { // in-place
		if (nameA < nameB) {
			return -1;
		}
		if (nameA > nameB) {
			return 1;
		}
		return 0;
	});
	if (_trace) log.debug(`%s sorted returnFields:%s`, LOG_PREFIX, toStr(returnFields));

	return returnFields;
}
