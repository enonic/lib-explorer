import {deepStrictEqual} from 'assert';

//import {VALUE_TYPE_STRING} from '@enonic/js-utils';
//import {VALUE_TYPE_STRING} from '../../../../build/swc/main/resources/lib/explorer/index.js';
//import libExplorer from '../../../../build/swc/main/resources/lib/explorer/index.js';

import {
	document
} from '../../../../build/rollup/index.mjs';

//const {VALUE_TYPE_STRING} = libExplorer;
const {validateTypes} = document;


const VALUE_TYPE_BOOLEAN = 'boolean';
const VALUE_TYPE_STRING = 'string';


const log = { //console.log console.trace
	debug: console.debug,
	error: console.error,
	info: console.info,
	warning: console.warn
};

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
}];


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
