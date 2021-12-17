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
	isDate,
	isGeoPoint,
	isInstantString,
	isInt,
	isLocalDateString,
	isLocalDateTimeString,
	isNotSet,
	isObject,
	//isSet,
	isString,
	isTimeString,
	toStr
} from '@enonic/js-utils/dist/esm/index.mjs';
import getIn from 'get-value';
import {v4 as isUuid4} from 'is-uuid';

import {logDummy} from './dummies';


interface LooseObject {
	[key :string] :unknown
}

interface Field {
	//readonly enabled :boolean
	//readonly fulltext :boolean
	//readonly includeInAllText :boolean
	//readonly max? :number
	//readonly min? :number
	readonly name :string
	//readonly nGram :boolean
	//readonly path :boolean
	readonly valueType? :string
}

interface ValidateTypesParameters {
	readonly data? :LooseObject
	readonly fields? :Field[]
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


export function validateTypes({
	data = {},
	fields = []
} :ValidateTypesParameters = {} , {
	log = logDummy
} = {}) {
	//log.debug(`validateTypes data:${toStr(data)}`);
	//log.debug(`validateTypes fields:${toStr(fields)}`);

	/*const enonifiedData = enonify(data); // NOTE enonify stringifies new Date(), etc
	log.debug(`validateOccurrences enonifiedData:${toStr(enonifiedData)}`);*/

	for (let i = 0; i < fields.length; i++) {
		const {
			valueType = VALUE_TYPE_STRING,
			name
		} = fields[i];
		//log.debug(`validateTypes name:${name} valueType:${valueType}`);

		const value = getIn(data, name);
		if (
			isNotSet(value)
			|| (Array.isArray(value) && !value.length) // Enonic XP doesn't index empty arrays // TODO flatten?
			|| valueType === VALUE_TYPE_ANY
		) {
			break;
		}

		const valueArray = forceArray(value); // In enonic/elastic all array items must have the same type?

		switch (valueType) {
		case VALUE_TYPE_STRING:
		case 'text': // TODO Remove in lib-explorer-4.0.0/app-explorer-2.0.0 ?
		case 'html':
		case 'tag':
		case 'uri':
		//case 'xml':
		for (let j = 0; j < valueArray.length; j++) {
				if (!isString(valueArray[j])) {
					const msg = [
						'validateTypes: Not a String:',
						valueArray[j],
						'at path:',
						`${name}${Array.isArray(value) ? `[${j}]` : ''}`,
						'in data:',
						data
					];
					log.debug(...msg);
					return false;
				} // if !string
			} // for
			break;
		case VALUE_TYPE_BOOLEAN:
			for (let j = 0; j < valueArray.length; j++) {
				if (typeof valueArray[j] !== VALUE_TYPE_BOOLEAN) {
					//const msg = `validateTypes: Not a Boolean:${toStr(valueArray[j])} at path:${name}${Array.isArray(value) ? `[${j}]` : ''} in data:${toStr(data)}!`;
					const msg = [
						'validateTypes: Not a Boolean:',
						valueArray[j],
						'at path:',
						`${name}${Array.isArray(value) ? `[${j}]` : ''}`,
						'in data:',
						data
					];
					log.debug(...msg);
					return false;
				}
			} // for
			break;
		case VALUE_TYPE_LONG:
			for (let j = 0; j < valueArray.length; j++) {
				if (!isInt(valueArray[j])) {
					const msg = [
						'validateTypes: Not an Integer:',
						valueArray[j],
						'at path:',
						`${name}${Array.isArray(value) ? `[${j}]` : ''}`,
						'in data:',
						data
					];
					log.debug(...msg);
					return false;
				}
			} // for
			break;
		case VALUE_TYPE_DOUBLE:
			for (let j = 0; j < valueArray.length; j++) {
				if (!isFloat(valueArray[j])) {
					//const msg = `validateTypes: Not a Number:${toStr(valueArray[j])} at path:${name}${Array.isArray(value) ? `[${j}]` : ''} in data:${toStr(data)}!`;
					const msg = [
						'validateTypes: Not a Number:',
						valueArray[j],
						'at path:',
						`${name}${Array.isArray(value) ? `[${j}]` : ''}`,
						'in data:',
						data
					];
					log.debug(...msg);
					return false;
				}
			} // for
			break;
		case VALUE_TYPE_SET:
			if (!isObject(value)) {
				const msg = `Not a Set:${toStr(value)} at path:${name} in data:${toStr(data)}!`;
				log.debug(msg);
				return false;
			}
			break;
		case VALUE_TYPE_GEO_POINT:
			if (!isGeoPoint(value)) {
				const msg = `Not a GeoPoint:${toStr(value)} at path:${name} in data:${toStr(data)}!`;
				log.debug(msg);
				return false;
			}
			break;
		case VALUE_TYPE_INSTANT:
			for (let j = 0; j < valueArray.length; j++) {
				if (!(isDate(valueArray[j]) || isInstantString(valueArray[j]))) {
					//const msg = `validateTypes: Not an Instant:${toStr(valueArray[j])} at path:${name}${Array.isArray(value) ? `[${j}]` : ''} in data:${toStr(data)}!`;
					const msg = [
						'validateTypes: Not an Instant:',
						valueArray[j],
						'at path:',
						`${name}${Array.isArray(value) ? `[${j}]` : ''}`,
						'in data:',
						data
					];
					log.debug(...msg);
					return false;
				}
			} // for
			break;
		case VALUE_TYPE_LOCAL_DATE:
			for (let j = 0; j < valueArray.length; j++) {
				if (!(isDate(valueArray[j]) || isLocalDateString(valueArray[j]))) {
					const msg = [
						'validateTypes: Not a LocalDate:',
						valueArray[j],
						'at path:',
						`${name}${Array.isArray(value) ? `[${j}]` : ''}`,
						'in data:',
						data
					];
					log.debug(...msg);
					return false;
				}
			} // for
			break;
		case VALUE_TYPE_LOCAL_DATE_TIME:
			for (let j = 0; j < valueArray.length; j++) {
				if (!(isDate(valueArray[j]) || isLocalDateTimeString(valueArray[j]))) {
					//const msg = `Not a LocalDateTime:${toStr(value)} at path:${name} in data:${toStr(data)}!`;
					const msg = [
						'validateTypes: Not a LocalDateTime:',
						valueArray[j],
						'at path:',
						`${name}${Array.isArray(value) ? `[${j}]` : ''}`,
						'in data:',
						data
					];
					log.debug(...msg);
					return false;
				} // if !localDate
			} // for
			break;
		case VALUE_TYPE_LOCAL_TIME:
			for (let j = 0; j < valueArray.length; j++) {
				if (!(isTimeString(valueArray[j]) || isDate(valueArray[j]))) {
					//const msg = `Not a LocalTime:${toStr(value)} at path:${name} in data:${toStr(data)}!`;
					const msg = [
						'validateTypes: Not a LocalTime:',
						valueArray[j],
						'at path:',
						`${name}${Array.isArray(value) ? `[${j}]` : ''}`,
						'in data:',
						data
					];
					log.debug(...msg);
					return false;
				} // if !localTime
			} // for
			break;
		case VALUE_TYPE_REFERENCE:
			for (let j = 0; j < valueArray.length; j++) {
				if (!isUuid4(valueArray[j])) {
					//const msg = `Not a Reference/UUIDv4 :${toStr(value)} at path:${name} in data:${toStr(data)}!`;
					const msg = [
						'validateTypes: Not a Reference/UUIDv4:',
						valueArray[j],
						'at path:',
						`${name}${Array.isArray(value) ? `[${j}]` : ''}`,
						'in data:',
						data
					];
					log.debug(...msg);
					return false;
				} // if !uuid
			} // for
			break;
		default:
			throw new Error(`Unhandeled valueType:${valueType}!`);
		}
	} // for
	return true;
}
