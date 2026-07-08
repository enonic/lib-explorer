import type { DocumentTypeField } from '@enonic-types/lib-explorer';

import { includes as arrayIncludes } from '@enonic/js-utils/array/includes';
import { isBoolean } from '@enonic/js-utils/value/isBoolean';
import { isObject } from '@enonic/js-utils/value/isObject';
import { isPositiveInteger } from '@enonic/js-utils/value/isPositiveInteger';
import { isString } from '@enonic/js-utils/value/isString';
import { toStr } from '@enonic/js-utils/value/toStr';

import {
	ALLOWED_PROPS,
	BOOLEAN_PROPS,
	POSITIVE_INTEGER_PROPS,
	VALUE_TYPES,
} from './constants';


const TRACE = false;
const LOG_PREFIX = 'isField()';


export function isField(
	value: unknown,
	{ _trace = TRACE } = {},
): value is DocumentTypeField {
	if (_trace) log.debug('%s value:%s', LOG_PREFIX, value);

	if (!isObject(value)) return false;

	const keys = Object.keys(value);
	for (let i = 0; i < keys.length; i++) {
		if (_trace) log.debug('%s i:%s', LOG_PREFIX, i);

		const key = keys[i];
		if (_trace) log.debug('%s i:%s key:%s', LOG_PREFIX, i, key);

		if (!arrayIncludes(ALLOWED_PROPS, key)) {
			log.warning('key:%s is not an allowed property on interface Field!', key);
			return false;
		} else {
			const property = (value as Record<string, unknown>)[key];
			if (_trace) log.debug('%s i:%s key:%s property:%s', LOG_PREFIX, i, key, property);

			if (arrayIncludes(BOOLEAN_PROPS, key)) {
				if (!isBoolean(property)) {
					log.warning(
						`key:%s value:%s is not of type boolean on interface Field!`,
						key, toStr(property)
					);
					return false;
				}
			} else if (arrayIncludes(POSITIVE_INTEGER_PROPS, key)) {
				if (!isPositiveInteger(property)) {
					log.warning(
						`key:%s value:%s is not of type PositiveInteger on interface Field!`,
						key, toStr(property)
					);
					return false;
				}
			} else if (key === 'name') {
				if (!isString(property)) {
					log.warning(
						`key:%s value:%s is not of type String on interface Field!`,
						key, toStr(property)
					);
					return false;
				}
			} else if (key === 'valueType') {
				if (!(isString(property) && arrayIncludes(VALUE_TYPES, property as string))) {
					log.warning(
						`key:%s value:%s is not of type ValueType on interface Field!`,
						key, toStr(property)
					);
					return false;
				}
			}
		} // else ALLOWED_PROPS
	} // for keys

	return true;
}
