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
	isTime,
	toStr
} from '@enonic/js-utils/dist/esm/index.mjs';
import getIn from 'get-value';
import {v4 as isUuid4} from 'is-uuid';


interface LooseObject {
	[key :string] :any
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


const DEFAULT_LOG = {
	debug: (s: string) /*:void*/ => {
		return s;
	},
	error: (s: string) /*:void*/ => {
		return s;
	},
	warning: (s: string) /*:void*/ => {
		return s;
	}
};


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
	log = DEFAULT_LOG
} = {}) {
	//log.debug(`validateTypes data:${toStr(data)}`);
	//log.debug(`validateTypes fields:${toStr(fields)}`);

	/*const enonifiedData = enonify(data); // NOTE enonify stringifies new Date(), etc
	log.debug(`validateOccurrences enonifiedData:${toStr(enonifiedData)}`);*/

	for (var i = 0; i < fields.length; i++) {
		const {
			valueType = VALUE_TYPE_STRING,
			name
		} = fields[i];
		log.debug(`validateTypes name:${name} valueType:${valueType}`);

		const value = getIn(data, name);
		if (isNotSet(value) || valueType === VALUE_TYPE_ANY) {
			break;
		}

		switch (valueType) {
		case VALUE_TYPE_STRING:
		case 'text': // TODO Remove in lib-explorer-4.0.0/app-explorer-2.0.0 ?
		case 'html':
		case 'tag':
		case 'uri':
		//case 'xml':
			if (!isString(value)) {
				const msg = `validateTypes: Not a String:${toStr(value)} at path:${name} in data:${toStr(data)}!`
				log.debug(msg);
				return false;
			}
			break;
		case VALUE_TYPE_BOOLEAN:
			if (typeof value !== VALUE_TYPE_BOOLEAN) {
				const msg = `validateTypes: Not a Boolean:${toStr(value)} at path:${name} in data:${toStr(data)}!`
				log.debug(msg);
				return false;
			}
			break;
		case VALUE_TYPE_LONG:
			if (!isInt(value)) {
				const msg = `Not an Integer:${toStr(value)} at path:${name} in data:${toStr(data)}!`;
				log.debug(msg);
				return false;
			}
			break;
		case VALUE_TYPE_DOUBLE:
			if (!isFloat(value)) {
				const msg = `Not a Number:${toStr(value)} at path:${name} in data:${toStr(data)}!`;
				log.debug(msg);
				return false;
			}
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
			if (!(isDate(value) || isInstantString(value))) {
				const msg = `Not an Instant:${toStr(value)} at path:${name} in data:${toStr(data)}!`;
				log.debug(msg);
				return false;
			}
			break;
		case VALUE_TYPE_LOCAL_DATE:
			if (!(isDate(value) || isLocalDateString(value))) {
				const msg = `Not a LocalDate:${toStr(value)} at path:${name} in data:${toStr(data)}!`;
				log.debug(msg);
				return false;
			}
			break;
		case VALUE_TYPE_LOCAL_DATE_TIME:
			if (!(isDate(value) || isLocalDateTimeString(value))) {
				const msg = `Not a LocalDateTime:${toStr(value)} at path:${name} in data:${toStr(data)}!`;
				log.debug(msg);
				return false;
			}
			break;
		case VALUE_TYPE_LOCAL_TIME:
			if (!(isTime(value) || isDate(value))) {
				const msg = `Not a LocalTime:${toStr(value)} at path:${name} in data:${toStr(data)}!`;
				log.debug(msg);
				return false;
			}
			break;
		case VALUE_TYPE_REFERENCE:
			if (!isUuid4(value)) {
				const msg = `Not a Reference/UUIDv4 :${toStr(value)} at path:${name} in data:${toStr(data)}!`;
				log.debug(msg);
				return false;
			}
			break;
		default:
			throw new Error(`Unhandeled valueType:${valueType}!`);
		}
	} // for
	return true;
}
