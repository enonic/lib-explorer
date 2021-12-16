import {deepStrictEqual} from 'assert';

//import {VALUE_TYPE_STRING} from '@enonic/js-utils';
//import {VALUE_TYPE_STRING} from '../../../../build/swc/main/resources/lib/explorer/index.js';
//import libExplorer from '../../../../build/swc/main/resources/lib/explorer/index.js';

import {
	document
} from '../../../../build/rollup/index.mjs';

//const {VALUE_TYPE_STRING} = libExplorer;
const {validateTypes} = document;


//export const VALUE_TYPE_ANY:string = 'any';
const VALUE_TYPE_BOOLEAN = 'boolean';
const VALUE_TYPE_STRING = 'string';
const VALUE_TYPE_DOUBLE = 'double';
const VALUE_TYPE_GEO_POINT = 'geoPoint';
const VALUE_TYPE_LONG = 'long';
const VALUE_TYPE_SET = 'set';
const VALUE_TYPE_INSTANT = 'instant';
const VALUE_TYPE_LOCAL_DATE = 'localDate';
const VALUE_TYPE_LOCAL_DATE_TIME = 'localDateTime';
const VALUE_TYPE_LOCAL_TIME = 'localTime';
const VALUE_TYPE_REFERENCE = 'reference';

const log = { //console.log console.trace
	debug: console.debug,
	error: console.error,
	info: console.info,
	warning: console.warn
};

const GEOPOINT_ARRAYS = [
	[59.9090442,10.7423389],
	[-90,-180],
	[90,-180],
	[0,0],
	[-90,180],
	[90,180]
]

const GEOPOINT_STRINGS = [
	'59.9090442,10.7423389',
	'-90,-180',
	'90,-180',
	'0,0',
	'-90,180',
	'90,180'
];

const INSTANT_STRINGS = [
	'2011-12-03T10:15:30Z',
	'2011-12-03T10:15:30.1Z',
	'2011-12-03T10:15:30.12Z',
	'2011-12-03T10:15:30.123Z',
	'2011-12-03T10:15:30.1234Z',
	'2011-12-03T10:15:30.12345Z',
	'2011-12-03T10:15:30.123456Z',
	'2011-12-03T10:15:30.1234567Z',
	'2011-12-03T10:15:30.12345678Z',
	'2011-12-03T10:15:30.123456789Z',
	new Date().toJSON(),
	new Date().toISOString()
];

const INVALID_INSTANT_STRINGS = [
	'2011-12-03T10:15Z', // java.time.format.DateTimeParseException: Text '2011-12-03T10:15Z' could not be parsed at index 16
	'2011-12-03T10:15:30', // java.time.format.DateTimeParseException: Text '2011-12-03T10:15:30' could not be parsed at index 19
	'2011-12-03T10:15:30.1234567890Z', // java.time.format.DateTimeParseException: Text '2011-12-03T10:15:30.1234567890Z' could not be parsed at index 29
	'2002-12-31T23:00:00+01:00', // java.time.format.DateTimeParseException: Text '2002-12-31T23:00:00+01:00' could not be parsed at index 19
	// Right format, but invalid time
	'2000-00-01T00:00:00Z',
	'2000-01-00T00:00:00Z',
	'2000-13-01T00:00:00Z',
	'2000-01-32T00:00:00Z',

	// Date.parse doesn't allow '2000-01-01T24:00:00Z'
	// For some reason lib-value.instant() does, but I'm sticking with Date.parse
	'2000-01-01T24:00:00Z',

	'2000-01-01T24:00:01Z',
	'2000-01-01T25:00:00Z',
	'2000-01-01T00:60:00Z',
	'2000-01-01T00:00:60Z',
];

const LOCAL_DATE_STRINGS_VALID = [
	'2011-12-03',
	'0000-01-01',
	'9999-12-31',
	//new Date(),
];

const LOCAL_DATE_STRINGS_INVALID = [
	// Invalid format
	'0000-1-01', // Text '0000-1-01' could not be parsed at index 5 java.time.format.DateTimeParseException
	'0000-01-01T', // Text '0000-01-01T' could not be parsed, unparsed text found at index 10 java.time.format.DateTimeParseException
	// Valid format, but invalid date
	'0000-00-01', // Text '0000-00-01' could not be parsed: Invalid value for MonthOfYear (valid values 1 - 12): 0 java.time.format.DateTimeParseException
	'0000-01-00', // Text '0000-01-00' could not be parsed: Invalid value for DayOfMonth (valid values 1 - 28/31): 0 java.time.format.DateTimeParseException
	'0000-13-01', // Text '0000-13-01' could not be parsed: Invalid value for MonthOfYear (valid values 1 - 12): 13 java.time.format.DateTimeParseException
	'0000-01-32', // Text '0000-01-32' could not be parsed: Invalid value for DayOfMonth (valid values 1 - 28/31): 32 java.time.format.DateTimeParseException
	// localDateString related, but not an actual localDateString
	new Date().toDateString(),
	new Date().toGMTString(),
	new Date().toJSON(),
	new Date().toLocaleDateString(),
	new Date().toLocaleString(),
	new Date().toLocaleTimeString(),
	new Date().toISOString(),
	//new Date().toSource(), // Deprecated
	new Date().toString(),
	new Date().toTimeString(),
	new Date().toUTCString(),
	Date.now(),
	Date.parse('2011-12-03T10:15:30Z'),
	Date.UTC(),
	// Invalid input
	'',
	'a',
	true,
	false,
	[],
	{},
	-1,
	1,
	-Infinity,
	Infinity
];

const TIME_STRINGS = [
	'00:00',
	'00:00:00',
	'00:00:00.', // Allowed
	'00:00:00.1',
	'00:00:00.12',
	'00:00:00.123',
	'00:00:00.1234',
	'00:00:00.12345',
	'00:00:00.123456',
	'00:00:00.1234567',
	'00:00:00.12345678',
	'00:00:00.123456789'
];


const GEOPOINTS = GEOPOINT_ARRAYS.concat(GEOPOINT_STRINGS);


const TESTS_VALID = [{
	/* No params :) */
},{
	data: {},
	//fields: []
}, {
	//data: {},
	fields: []
},{
	data: {},
	fields: []
},{
	data: {
		text: ''
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
},{
	data: {
		text: 'a'
	},
	fields: [{
		valueType: VALUE_TYPE_STRING,
		name: 'text'
	}]
},{
	data: {
		boolean: false
	},
	fields: [{
		valueType: VALUE_TYPE_BOOLEAN,
		name: 'boolean'
	}]
},{
	data: {
		boolean: true
	},
	fields: [{
		valueType: VALUE_TYPE_BOOLEAN,
		name: 'boolean'
	}]
},{
	data: {
		long: 1
	},
	fields: [{
		valueType: VALUE_TYPE_LONG,
		name: 'long'
	}]
},{
	data: {
		double: 1.1
	},
	fields: [{
		valueType: VALUE_TYPE_DOUBLE,
		name: 'double'
	}]
},{
	data: {
		doubleDecimalZero: 1.0
	},
	fields: [{
		valueType: VALUE_TYPE_DOUBLE,
		name: 'doubleDecimalZero'
	}]
},{
	data: {
		object: {}
	},
	fields: [{
		valueType: VALUE_TYPE_SET,
		name: 'object'
	}]
}].concat(GEOPOINTS.map(v => ({
	data: {
		geoPoint: v
	},
	fields: [{
		valueType: VALUE_TYPE_GEO_POINT,
		name: 'geoPoint'
	}]
})))
.concat(INSTANT_STRINGS.map(v => ({
	data: {
		instant: v
	},
	fields: [{
		valueType: VALUE_TYPE_INSTANT,
		name: 'instant'
	}]
}))).concat([{
	data: {
		instant: new Date()
	},
	fields: [{
		valueType: VALUE_TYPE_INSTANT,
		name: 'instant'
	}]
},{
	data: {
		localDate: new Date()
	},
	fields: [{
		valueType: VALUE_TYPE_LOCAL_DATE,
		name: 'localDate'
	}]
},{
	data: {
		localDateTime: '2007-12-03T10:15:30'
	},
	fields: [{
		valueType: VALUE_TYPE_LOCAL_DATE_TIME,
		name: 'localDateTime'
	}]
},{
	data: {
		localDateTime: new Date()
	},
	fields: [{
		valueType: VALUE_TYPE_LOCAL_DATE_TIME,
		name: 'localDateTime'
	}]
},{
	data: {
		localTime: new Date()
	},
	fields: [{
		valueType: VALUE_TYPE_LOCAL_TIME,
		name: 'localTime'
	}]
}]).concat(TIME_STRINGS.map(t => ({
	data: {
		localTime: t
	},
	fields: [{
		valueType: VALUE_TYPE_LOCAL_TIME,
		name: 'localTime'
	}]
}))).concat(LOCAL_DATE_STRINGS_VALID.map(ld => ({
	data: {
		localDate: ld
	},
	fields: [{
		valueType: VALUE_TYPE_LOCAL_DATE,
		name: 'localDate'
	}]
})));


const TESTS_INVALID = [{
	data: {
		text: true
	},
	fields: [{
		valueType: VALUE_TYPE_STRING,
		name: 'text'
	}]
},{
	data: {
		text: false
	},
	fields: [{
		valueType: VALUE_TYPE_STRING,
		name: 'text'
	}]
},{
	data: {
		text: {}
	},
	fields: [{
		valueType: VALUE_TYPE_STRING,
		name: 'text'
	}]
},{
	data: {
		text: new Date() // Oh no, enonify stringifies dates!
	},
	fields: [{
		valueType: VALUE_TYPE_STRING,
		name: 'text'
	}]
},{
	data: {
		text: 1
	},
	fields: [{
		valueType: VALUE_TYPE_STRING,
		name: 'text'
	}]
},{
	data: {
		boolean: 'string'
	},
	fields: [{
		valueType: VALUE_TYPE_BOOLEAN,
		name: 'boolean'
	}]
},{
	data: {
		notLong: 1.1
	},
	fields: [{
		valueType: VALUE_TYPE_LONG,
		name: 'notLong'
	}]
},{
	data: {
		notDouble: false
	},
	fields: [{
		valueType: VALUE_TYPE_LONG,
		name: 'notDouble'
	}]
},{
	data: {
		notObject: false
	},
	fields: [{
		valueType: VALUE_TYPE_SET,
		name: 'notObject'
	}]
}].concat(INVALID_INSTANT_STRINGS.map(v => ({
	data: {
		instant: v
	},
	fields: [{
		valueType: VALUE_TYPE_INSTANT,
		name: 'instant'
	}]
}))).concat(LOCAL_DATE_STRINGS_INVALID.map(ld => ({
	data: {
		localDate: ld
	},
	fields: [{
		valueType: VALUE_TYPE_LOCAL_DATE,
		name: 'localDate'
	}]
})));;


function toStr(v) { return JSON.stringify(v); }


describe('document', () => {
	describe('validateTypes()', () => {
		describe('--> true', () => {
			TESTS_VALID.forEach((params) => {
				it(`${toStr(params)}`, () => {
					deepStrictEqual(
						true,
						validateTypes(params/*, {log}*/)
					);
				});
			});
		});
		describe('--> false', () => {
			TESTS_INVALID.forEach((params) => {
				it(`${toStr(params)}`, () => {
					deepStrictEqual(
						false,
						validateTypes(params/*, {log}*/)
					);
				});
			});
		});
	}); // describe validateOccurrences()
}); // describe document
