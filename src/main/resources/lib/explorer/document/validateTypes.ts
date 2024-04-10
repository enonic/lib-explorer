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
import type {DocumentTypeFields} from '@enonic-types/lib-explorer';


import {
	VALUE_TYPE_ANY,
	VALUE_TYPE_BOOLEAN,
	VALUE_TYPE_DOUBLE,
	VALUE_TYPE_GEO_POINT,
	VALUE_TYPE_INSTANT,
	VALUE_TYPE_LOCAL_DATE,
	VALUE_TYPE_LOCAL_DATE_TIME,
	VALUE_TYPE_LOCAL_TIME,
	VALUE_TYPE_LONG,
	VALUE_TYPE_REFERENCE,
	VALUE_TYPE_SET,
	VALUE_TYPE_STRING,
	//enonify,
	forceArray,
	getIn,
	isDate,
	isGeoPoint,
	isGeoPointArray,
	isInstantString,
	isInt,
	isLocalDateString,
	isLocalDateTimeString,
	isNotSet,
	isObject,
	//isSet,
	isString,
	isTimeString,
	isUuidV4String//,
	//toStr
} from '@enonic/js-utils';
//import {v4 as isUuid4} from 'is-uuid';


export interface ValidateTypesParameters {
	data?: Record<string, unknown>
	fields?: DocumentTypeFields
}


// Any Float number with a zero decimal part are implicitly cast to Integer,
// so it is not possible to check if they are Float or not.
function isFloat(n) {
	return Number(n) === n;
	//return Number(n) === n && n % 1 !== 0; //

	// Test whether a value is a number primitive value that has no fractional
	// part and is within the size limits of what can be represented as an exact integer
	//return n === +n && n !== (n|0);
}


export function validateTypes(
	{
		data = {},
		fields = []
	}: ValidateTypesParameters = {},
) {
	// log.debug(`validateTypes data:${toStr(data)}`);
	// log.debug(`validateTypes fields:${toStr(fields)}`);

	// const enonifiedData = enonify(data); // NOTE enonify stringifies new Date(), etc
	// log.debug(`validateOccurrences enonifiedData:${toStr(enonifiedData)}`);

	for (let i = 0; i < fields.length; i++) {
		const {
			valueType = VALUE_TYPE_STRING,
			name
		} = fields[i];
		// log.debug(`validateTypes name:${name} valueType:${valueType}`);

		const value = getIn(data, name);
		if (
			isNotSet(value)
			|| (Array.isArray(value) && !value.length) // Enonic XP doesn't index empty arrays // TODO flatten?
			|| valueType === VALUE_TYPE_ANY
		) {
			break;
		}

		switch (valueType) {
		case VALUE_TYPE_STRING:
		case 'text': // TODO Remove in lib-explorer-4.0.0/app-explorer-2.0.0 ?
		case 'html':
		case 'tag':
		case 'uri':
		// case 'xml':
		{
			const valueArray = forceArray(value);
			for (let j = 0; j < valueArray.length; j++) {
				if (!isString(valueArray[j])) {
					log.warning(
						'validateTypes: Not a String:',
						valueArray[j],
						'at path:',
						`${name}${Array.isArray(value) ? `[${j}]` : ''}`,
						'in data:',
						data
					);
					return false;
				} // if !string
			} // for
			break;
		}
		case VALUE_TYPE_BOOLEAN: {
			const valueArray = forceArray(value);
			for (let j = 0; j < valueArray.length; j++) {
				if (typeof valueArray[j] !== VALUE_TYPE_BOOLEAN) {
					// const msg = `validateTypes: Not a Boolean:${toStr(valueArray[j])} at path:${name}${Array.isArray(value) ? `[${j}]` : ''} in data:${toStr(data)}!`;
					log.warning(
						'validateTypes: Not a Boolean:',
						valueArray[j],
						'at path:',
						`${name}${Array.isArray(value) ? `[${j}]` : ''}`,
						'in data:',
						data
					);
					return false;
				}
			} // for
			break;
		}
		case VALUE_TYPE_LONG: {
			const valueArray = forceArray(value);
			for (let j = 0; j < valueArray.length; j++) {
				if (!isInt(valueArray[j])) {
					log.warning(
						'validateTypes: Not an Integer:',
						valueArray[j],
						'at path:',
						`${name}${Array.isArray(value) ? `[${j}]` : ''}`,
						'in data:',
						data
					);
					return false;
				}
			} // for
			break;
		}
		case VALUE_TYPE_DOUBLE: {
			const valueArray = forceArray(value);
			for (let j = 0; j < valueArray.length; j++) {
				if (!isFloat(valueArray[j])) {
					// const msg = `validateTypes: Not a Number:${toStr(valueArray[j])} at path:${name}${Array.isArray(value) ? `[${j}]` : ''} in data:${toStr(data)}!`;
					log.warning(
						'validateTypes: Not a Number:',
						valueArray[j],
						'at path:',
						`${name}${Array.isArray(value) ? `[${j}]` : ''}`,
						'in data:',
						data
					);
					return false;
				}
			} // for
			break;
		}

		case VALUE_TYPE_SET: {
			const valueArray = forceArray(value);
			log.debug('valueArray', valueArray);
			for (let j = 0; j < valueArray.length; j++) {
				log.debug('valueArray[', j, ']', valueArray[j]);
				if (!isObject(valueArray[j])) {
					// const msg = `Not a Set:${toStr(value)} at path:${name} in data:${toStr(data)}!`;
					log.warning(
						'validateTypes: Not a Set:',
						valueArray[j],
						'at path:',
						`${name}${Array.isArray(value) ? `[${j}]` : ''}`,
						'in data:',
						data
					);
					return false;
				} // if !isObject
				break;
			} // for
		} // case VALUE_TYPE_SET

		case VALUE_TYPE_GEO_POINT: { // eslint-disable-line no-fallthrough
			const customValueArray = isGeoPointArray(value) ? [value] : forceArray(value);
			for (let j = 0; j < customValueArray.length; j++) {
				if (!isGeoPoint(customValueArray[j])) {
					// const msg = `Not a GeoPoint:${toStr(value)} at path:${name} in data:${toStr(data)}!`;
					log.warning(
						'validateTypes: Not a GeoPoint:',
						customValueArray[j],
						'at path:',
						`${name}${Array.isArray(value) ? `[${j}]` : ''}`,
						'in data:',
						data
					);
					return false;
				} // if !geoPoint
			} // for
			break;
		}
		case VALUE_TYPE_INSTANT: {
			const valueArray = forceArray(value);
			for (let j = 0; j < valueArray.length; j++) {
				if (!(isDate(valueArray[j]) || isInstantString(valueArray[j]))) {
					// const msg = `validateTypes: Not an Instant:${toStr(valueArray[j])} at path:${name}${Array.isArray(value) ? `[${j}]` : ''} in data:${toStr(data)}!`;
					log.warning(
						'validateTypes: Not an Instant:',
						valueArray[j],
						'at path:',
						`${name}${Array.isArray(value) ? `[${j}]` : ''}`,
						'in data:',
						data
					);
					return false;
				}
			} // for
			break;
		}
		case VALUE_TYPE_LOCAL_DATE: {
			const valueArray = forceArray(value);
			for (let j = 0; j < valueArray.length; j++) {
				if (!(isDate(valueArray[j]) || isLocalDateString(valueArray[j]))) {
					log.warning(
						'validateTypes: Not a LocalDate:',
						valueArray[j],
						'at path:',
						`${name}${Array.isArray(value) ? `[${j}]` : ''}`,
						'in data:',
						data
					);
					return false;
				}
			} // for
			break;
		}
		case VALUE_TYPE_LOCAL_DATE_TIME: {
			const valueArray = forceArray(value);
			for (let j = 0; j < valueArray.length; j++) {
				if (!(isDate(valueArray[j]) || isLocalDateTimeString(valueArray[j]))) {
					// const msg = `Not a LocalDateTime:${toStr(value)} at path:${name} in data:${toStr(data)}!`;
					log.warning(
						'validateTypes: Not a LocalDateTime:',
						valueArray[j],
						'at path:',
						`${name}${Array.isArray(value) ? `[${j}]` : ''}`,
						'in data:',
						data
					);
					return false;
				} // if !localDate
			} // for
			break;
		}
		case VALUE_TYPE_LOCAL_TIME: {
			const valueArray = forceArray(value);
			for (let j = 0; j < valueArray.length; j++) {
				if (!(isTimeString(valueArray[j]) || isDate(valueArray[j]))) {
					// const msg = `Not a LocalTime:${toStr(value)} at path:${name} in data:${toStr(data)}!`;
					log.warning(
						'validateTypes: Not a LocalTime:',
						valueArray[j],
						'at path:',
						`${name}${Array.isArray(value) ? `[${j}]` : ''}`,
						'in data:',
						data
					);
					return false;
				} // if !localTime
			} // for
			break;
		}
		case VALUE_TYPE_REFERENCE: {
			const valueArray = forceArray(value);
			for (let j = 0; j < valueArray.length; j++) {
				if (!isUuidV4String(valueArray[j])) {
					// const msg = `Not a Reference/UUIDv4 :${toStr(value)} at path:${name} in data:${toStr(data)}!`;
					log.warning(
						'validateTypes: Not a Reference/UUIDv4:',
						valueArray[j],
						'at path:',
						`${name}${Array.isArray(value) ? `[${j}]` : ''}`,
						'in data:',
						data
					);
					return false;
				} // if !uuid
			} // for
			break;
		}
		default:
			throw new Error(`Unhandeled valueType:${valueType}!`);
		}
	} // for
	return true;
}
