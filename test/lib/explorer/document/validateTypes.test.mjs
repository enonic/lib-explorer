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
	INSTANT_STRINGS,
	INTEGERS, // long
	INVALID_INSTANT_STRINGS,
	LOCAL_DATE_STRINGS_INVALID,
	LOCAL_DATE_STRINGS_VALID,
	LOCAL_DATE_TIME_STRINGS_INVALID,
	LOCAL_DATE_TIME_STRINGS_VALID,
	NOT_BOOLEANS,
	NOT_INTEGERS,
	NOT_NUMBERS,
	NOT_STRINGS,
	NOT_UUIDV4,
	STRINGS,
	TIME_STRINGS,
	UUIDV4
} from '../../../testData.mjs';

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


/*const log = { //console.log console.trace
	debug: console.debug,
	error: console.error,
	info: console.info,
	warning: console.warn
};*/


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
},{
	data: {
		object: {}
	},
	fields: [{
		valueType: VALUE_TYPE_SET,
		name: 'object'
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
	FLOATS.map(double => ({
		data: {
			double
		},
		fields: [{
			valueType: VALUE_TYPE_DOUBLE,
			name: 'double'
		}]
	})),
	GEOPOINTS.map(v => ({
		data: {
			geoPoint: v
		},
		fields: [{
			valueType: VALUE_TYPE_GEO_POINT,
			name: 'geoPoint'
		}]
	})),
	INSTANT_STRINGS.map(v => ({
		data: {
			instant: v
		},
		fields: [{
			valueType: VALUE_TYPE_INSTANT,
			name: 'instant'
		}]
	})),
	[{
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
	}],
	INTEGERS.map(integer => ({
		data: {
			long: integer
		},
		fields: [{
			valueType: VALUE_TYPE_LONG,
			name: 'long'
		}]
	})),
	TIME_STRINGS.map(t => ({
		data: {
			localTime: t
		},
		fields: [{
			valueType: VALUE_TYPE_LOCAL_TIME,
			name: 'localTime'
		}]
	})),
	LOCAL_DATE_STRINGS_VALID.map(ld => ({
		data: {
			localDate: ld
		},
		fields: [{
			valueType: VALUE_TYPE_LOCAL_DATE,
			name: 'localDate'
		}]
	})),
	LOCAL_DATE_TIME_STRINGS_VALID.map(ldt => ({
		data: {
			localDateTime: ldt
		},
		fields: [{
			valueType: VALUE_TYPE_LOCAL_DATE_TIME,
			name: 'localDateTime'
		}]
	})),
	STRINGS.map(string => ({
		data: {
			string
		},
		fields: [{
			valueType: VALUE_TYPE_STRING,
			name: 'string'
		}]
	})),
	UUIDV4.map(uuidv4 => ({
		data: {
			reference: uuidv4
		},
		fields: [{
			valueType: VALUE_TYPE_REFERENCE,
			name: 'reference'
		}]
	}))
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
	NOT_NUMBERS.map(notDouble => ({
		data: {
			double: notDouble
		},
		fields: [{
			valueType: VALUE_TYPE_DOUBLE,
			name: 'double'
		}]
	})),
	INVALID_INSTANT_STRINGS.map(v => ({
		data: {
			instant: v
		},
		fields: [{
			valueType: VALUE_TYPE_INSTANT,
			name: 'instant'
		}]
	})),
	NOT_INTEGERS.map(notInteger => ({
		data: {
			long: notInteger
		},
		fields: [{
			valueType: VALUE_TYPE_LONG,
			name: 'long'
		}]
	})),
	LOCAL_DATE_STRINGS_INVALID.map(ld => ({
		data: {
			localDate: ld
		},
		fields: [{
			valueType: VALUE_TYPE_LOCAL_DATE,
			name: 'localDate'
		}]
	})),
	LOCAL_DATE_TIME_STRINGS_INVALID.map(ldt => ({
		data: {
			localDateTime: ldt
		},
		fields: [{
			valueType: VALUE_TYPE_LOCAL_DATE_TIME,
			name: 'localDateTime'
		}]
	})),
	NOT_STRINGS.map(notString => ({
		data: {
			string: notString
		},
		fields: [{
			valueType: VALUE_TYPE_STRING,
			name: 'string'
		}]
	})),
	NOT_UUIDV4.map(notUuidv4 => ({
		data: {
			reference: notUuidv4
		},
		fields: [{
			valueType: VALUE_TYPE_REFERENCE,
			name: 'reference'
		}]
	}))
); // concat


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
