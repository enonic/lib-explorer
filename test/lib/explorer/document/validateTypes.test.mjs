import {deepStrictEqual} from 'assert';

//import {VALUE_TYPE_STRING} from '@enonic/js-utils';
//import {VALUE_TYPE_STRING} from '../../../../build/swc/main/resources/lib/explorer/index.js';
//import libExplorer from '../../../../build/swc/main/resources/lib/explorer/index.js';

import {
	document
} from '../../../../build/rollup/index.mjs';

import {
	BOOLEANS,
	GEOPOINTS,
	EMPTY_STRING,
	FLOATS, // double
	INSTANTS,
	INSTANT_STRINGS_INVALID,
	INTEGERS, // long
	LOCAL_DATE_STRINGS_INVALID,
	LOCAL_DATE_TIMES,
	LOCAL_DATE_TIME_STRINGS_INVALID,
	LOCAL_DATES,
	LOCAL_TIMES,
	OBJECTS,
	NOT_BOOLEANS,
	NOT_GEOPOINTS,
	NOT_INTEGERS,
	NOT_NUMBERS,
	NOT_OBJECTS,
	NOT_STRINGS,
	NOT_UUIDV4,
	STRINGS,
	UUIDV4
} from '../../../testData.mjs';

//const {VALUE_TYPE_STRING} = libExplorer;
const {validateTypes} = document;


//export const VALUE_TYPE_ANY:string = 'any';
const VALUE_TYPE_BOOLEAN = 'boolean';
const VALUE_TYPE_DOUBLE = 'double';
const VALUE_TYPE_GEO_POINT = 'geoPoint';
const VALUE_TYPE_LONG = 'long';
const VALUE_TYPE_SET = 'set';
const VALUE_TYPE_INSTANT = 'instant';
const VALUE_TYPE_LOCAL_DATE = 'localDate';
const VALUE_TYPE_LOCAL_DATE_TIME = 'localDateTime';
const VALUE_TYPE_LOCAL_TIME = 'localTime';
const VALUE_TYPE_REFERENCE = 'reference';
const VALUE_TYPE_STRING = 'string';


const log = { //console.log console.trace
	debug: () => {/**/},
	//debug: (...s) => console.debug('DEBUG', ...s),
	error: (...s) => console.error('ERROR', ...s),
	info: (...s) => console.info('INFO ', ...s),
	warning: (...s) => console.warn('WARN ', ...s)
};


const TESTS_VALID = [{
	/* No params :) */
},{
	data: {}//,
	//fields: []
}, {
	//data: {},
	fields: []
},{
	data: {},
	fields: []
},{
	data: {
		text: EMPTY_STRING
	},
	fields: [{
		//valueType: VALUE_TYPE_STRING,
		name: 'text'
	}]
},{
	data: {
		text: 'a'
	},
	fields: [{
		//valueType: VALUE_TYPE_STRING,
		name: 'text'
	}]
}].concat(
	BOOLEANS.map(boolean => ({
		data: {
			boolean
		},
		fields: [{
			valueType: VALUE_TYPE_BOOLEAN,
			name: 'boolean'
		}]
	})),
	{
		data: {
			booleanArray: BOOLEANS
		},
		fields: [{
			valueType: VALUE_TYPE_BOOLEAN,
			//min: 0 || >2,
			name: 'booleanArray'
		}]
	},
	FLOATS.map(double => ({
		data: {
			double
		},
		fields: [{
			valueType: VALUE_TYPE_DOUBLE,
			name: 'double'
		}]
	})),
	{
		data: {
			doubleArray: FLOATS
		},
		fields: [{
			valueType: VALUE_TYPE_DOUBLE,
			//min: 0 || >2,
			name: 'doubleArray'
		}]
	},
	GEOPOINTS.map(v => ({
		data: {
			geoPoint: v
		},
		fields: [{
			valueType: VALUE_TYPE_GEO_POINT,
			name: 'geoPoint'
		}]
	})),
	{
		data: {
			geoPointArray: GEOPOINTS
		},
		fields: [{
			valueType: VALUE_TYPE_GEO_POINT,
			name: 'geoPointArray'
		}]
	},
	INSTANTS.map(instant => ({
		data: {
			instant
		},
		fields: [{
			valueType: VALUE_TYPE_INSTANT,
			name: 'instant'
		}]
	})),
	{
		data: {
			instantArray: INSTANTS
		},
		fields: [{
			valueType: VALUE_TYPE_INSTANT,
			//min: 0 || >2,
			name: 'instantArray'
		}]
	},{
		data: {
			localDateTime: '2007-12-03T10:15:30'
		},
		fields: [{
			valueType: VALUE_TYPE_LOCAL_DATE_TIME,
			name: 'localDateTime'
		}]
	},
	INTEGERS.map(integer => ({
		data: {
			long: integer
		},
		fields: [{
			valueType: VALUE_TYPE_LONG,
			name: 'long'
		}]
	})),
	{
		data: {
			longArray: INTEGERS
		},
		fields: [{
			//min: 0 || >2,
			name: 'longArray',
			valueType: VALUE_TYPE_LONG
		}]
	},
	LOCAL_DATES.map(localDate => ({
		data: {
			localDate
		},
		fields: [{
			valueType: VALUE_TYPE_LOCAL_DATE,
			name: 'localDate'
		}]
	})),
	{
		data: {
			localDateArray: LOCAL_DATES
		},
		fields: [{
			valueType: VALUE_TYPE_LOCAL_DATE,
			name: 'localDateArray'
		}]
	},
	LOCAL_DATE_TIMES.map(localDateTime => ({
		data: {
			localDateTime
		},
		fields: [{
			valueType: VALUE_TYPE_LOCAL_DATE_TIME,
			name: 'localDateTime'
		}]
	})),
	{
		data: {
			localDateTimeArray: LOCAL_DATE_TIMES
		},
		fields: [{
			valueType: VALUE_TYPE_LOCAL_DATE_TIME,
			name: 'localDateTimeArray'
		}]
	},
	LOCAL_TIMES.map(localTime => ({
		data: {
			localTime
		},
		fields: [{
			valueType: VALUE_TYPE_LOCAL_TIME,
			name: 'localTime'
		}]
	})),
	{
		data: {
			localTimeArray: LOCAL_TIMES
		},
		fields: [{
			valueType: VALUE_TYPE_LOCAL_TIME,
			name: 'localTimeArray'
		}]
	},
	OBJECTS.map(object => ({
		data: {
			object
		},
		fields: [{
			valueType: VALUE_TYPE_SET,
			name: 'object'
		}]
	})),
	{
		data: {
			objectArray: OBJECTS
		},
		fields: [{
			valueType: VALUE_TYPE_SET,
			name: 'objectArray'
		}]
	},
	STRINGS.map(string => ({
		data: {
			string
		},
		fields: [{
			valueType: VALUE_TYPE_STRING,
			name: 'string'
		}]
	})),
	{
		data: {
			stringArray: STRINGS
		},
		fields: [{
			//min: 0 || >2,
			name: 'stringArray',
			valueType: VALUE_TYPE_STRING
		}]
	},
	UUIDV4.map(uuidv4 => ({
		data: {
			reference: uuidv4
		},
		fields: [{
			name: 'reference',
			valueType: VALUE_TYPE_REFERENCE
		}]
	})),
	{
		data: {
			referenceArray: UUIDV4
		},
		fields: [{
			name: 'referenceArray',
			valueType: VALUE_TYPE_REFERENCE
		}]
	}
); // concat


const TESTS_INVALID = [{
	data: {
		notObject: false
	},
	fields: [{
		valueType: VALUE_TYPE_SET,
		name: 'notObject'
	}]
}].concat(
	NOT_BOOLEANS.map(notBoolean => ({
		data: {
			boolean: notBoolean
		},
		fields: [{
			valueType: VALUE_TYPE_BOOLEAN,
			name: 'boolean'
		}]
	})),
	{
		data: {
			booleanArray: BOOLEANS.concat(NOT_BOOLEANS)
		},
		fields: [{
			valueType: VALUE_TYPE_BOOLEAN,
			name: 'booleanArray'
		}]
	},
	NOT_NUMBERS.map(notDouble => ({
		data: {
			double: notDouble
		},
		fields: [{
			valueType: VALUE_TYPE_DOUBLE,
			name: 'double'
		}]
	})),
	{
		data: {
			doubleArray: FLOATS.concat(NOT_NUMBERS)
		},
		fields: [{
			valueType: VALUE_TYPE_DOUBLE,
			//min: 0 || >2,
			name: 'doubleArray'
		}]
	},
	NOT_GEOPOINTS.map(notGeoPoint => ({
		data: {
			geoPoint: notGeoPoint
		},
		fields: [{
			valueType: VALUE_TYPE_GEO_POINT,
			name: 'geoPoint'
		}]
	})),
	{
		data: {
			geoPointArray: GEOPOINTS.concat(NOT_GEOPOINTS)
		},
		fields: [{
			valueType: VALUE_TYPE_GEO_POINT,
			name: 'geoPointArray'
		}]
	},
	INSTANT_STRINGS_INVALID.map(v => ({
		data: {
			instant: v
		},
		fields: [{
			valueType: VALUE_TYPE_INSTANT,
			name: 'instant'
		}]
	})),
	{
		data: {
			instantArray: INSTANTS.concat(INSTANT_STRINGS_INVALID)
		},
		fields: [{
			valueType: VALUE_TYPE_INSTANT,
			//min: 0 || >2,
			name: 'instantArray'
		}]
	},
	NOT_INTEGERS.map(notInteger => ({
		data: {
			long: notInteger
		},
		fields: [{
			valueType: VALUE_TYPE_LONG,
			name: 'long'
		}]
	})),
	{
		data: {
			longArray: INTEGERS.concat(NOT_INTEGERS)
		},
		fields: [{
			//min: 0 || >2,
			name: 'longArray',
			valueType: VALUE_TYPE_LONG
		}]
	},
	LOCAL_DATE_STRINGS_INVALID.map(notLocalDate => ({
		data: {
			localDate: notLocalDate
		},
		fields: [{
			valueType: VALUE_TYPE_LOCAL_DATE,
			name: 'localDate'
		}]
	})),
	{
		data: {
			localDateArray: LOCAL_DATES.concat(LOCAL_DATE_STRINGS_INVALID)
		},
		fields: [{
			valueType: VALUE_TYPE_LOCAL_DATE,
			name: 'localDateArray'
		}]
	},
	LOCAL_DATE_TIME_STRINGS_INVALID.map(ldt => ({
		data: {
			localDateTime: ldt
		},
		fields: [{
			valueType: VALUE_TYPE_LOCAL_DATE_TIME,
			name: 'localDateTime'
		}]
	})),
	{
		data: {
			localDateTimeArray: LOCAL_DATE_TIMES.concat(LOCAL_DATE_TIME_STRINGS_INVALID)
		},
		fields: [{
			valueType: VALUE_TYPE_LOCAL_DATE_TIME,
			name: 'localDateTimeArray'
		}]
	},
	LOCAL_DATE_TIME_STRINGS_INVALID.map(notLocalTime => ({
		data: {
			localTime: notLocalTime
		},
		fields: [{
			valueType: VALUE_TYPE_LOCAL_TIME,
			name: 'localTime'
		}]
	})),
	{
		data: {
			localTimeArray: LOCAL_TIMES.concat(LOCAL_DATE_TIME_STRINGS_INVALID)
		},
		fields: [{
			valueType: VALUE_TYPE_LOCAL_TIME,
			name: 'localTimeArray'
		}]
	},
	NOT_OBJECTS.map(notObject => ({
		data: {
			object: notObject
		},
		fields: [{
			valueType: VALUE_TYPE_SET,
			name: 'object'
		}]
	})),
	{
		data: {
			objectArray: OBJECTS.concat(NOT_OBJECTS)
		},
		fields: [{
			valueType: VALUE_TYPE_SET,
			name: 'objectArray'
		}]
	},
	NOT_STRINGS.map(notString => ({
		data: {
			string: notString
		},
		fields: [{
			valueType: VALUE_TYPE_STRING,
			name: 'string'
		}]
	})),
	{
		data: {
			stringArray: STRINGS.concat(NOT_STRINGS)
		},
		fields: [{
			valueType: VALUE_TYPE_STRING,
			name: 'stringArray'
		}]
	},
	NOT_UUIDV4.map(notUuidv4 => ({
		data: {
			reference: notUuidv4
		},
		fields: [{
			valueType: VALUE_TYPE_REFERENCE,
			name: 'reference'
		}]
	})),
	{
		data: {
			referenceArray: UUIDV4.concat(NOT_UUIDV4)
		},
		fields: [{
			name: 'referenceArray',
			valueType: VALUE_TYPE_REFERENCE
		}]
	}
); // concat


function toStr(v) { return JSON.stringify(v); }


describe('document', () => {
	describe('validateTypes()', () => {
		describe('--> true', () => {
			TESTS_VALID.forEach((params) => {
				it(`${toStr(params)}`, () => {
					deepStrictEqual(
						true,
						validateTypes(params, {log})
					);
				});
			});
		});
		describe('--> false', () => {
			TESTS_INVALID.forEach((params) => {
				it(`${toStr(params)}`, () => {
					deepStrictEqual(
						false,
						validateTypes(params, {log})
					);
				});
			});
		});
	}); // describe validateOccurrences()
}); // describe document
