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
/*export const VALUE_TYPE_INSTANT:string = 'instant';
export const VALUE_TYPE_LOCAL_DATE:string = 'localDate';
export const VALUE_TYPE_LOCAL_DATE_TIME:string = 'localDateTime';
export const VALUE_TYPE_LOCAL_TIME:string = 'localTime';
export const VALUE_TYPE_REFERENCE:string = 'reference';*/

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
}];


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
