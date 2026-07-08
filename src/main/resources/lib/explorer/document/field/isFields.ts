import type { DocumentTypeFields } from '@enonic-types/lib-explorer';

import { toStr } from '@enonic/js-utils/value/toStr';

import { isField } from './isField';


const TRACE = false;
const LOG_PREFIX = 'isFields()';


export function isFields(
	fields: unknown,
	{ _trace = TRACE } = {},
): fields is DocumentTypeFields {
	if (_trace) log.debug('%s fields:%s', LOG_PREFIX, toStr(fields));

	if (!Array.isArray(fields)) return false;

	for (let i = 0; i < fields.length; i++) {
		const field = fields[i];
		if (_trace) log.debug('%s i:%s field:%s', LOG_PREFIX, i, field);
		if (!isField(field)) {
			return false;
		}
	}

	return true;
}
