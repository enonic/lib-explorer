import {deepStrictEqual} from 'assert';

import {
	document
} from '../../../../build/rollup/index.mjs';

const {validateOccurrences} = document;


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
		text: null
	},
	fields: [{
		name: 'text'
	}]
},{
	data: {
		text: 'a'
	},
	fields: [{
		min: 1,
		name: 'text'
	}]
},{
	data: {
		text: ['a','b']
	},
	fields: [{
		min: 2,
		name: 'text'
	}]
}];


const TESTS_INVALID = [{
	data: {},
	fields: [{
		min: 1,
		name: 'text'
	}]
},{
	data: {
		text: ''
	},
	fields: [{
		min: 1,
		name: 'text'
	}]
},/*{
	data: {
		text: {} // Enonified away?
	},
	fields: [{
		min: 1,
		name: 'text'
	}]
},*/{
	data: {
		text: []
	},
	fields: [{
		min: 1,
		name: 'text'
	}]
},{
	data: {
		text: [[]] // Enonified away
	},
	fields: [{
		min: 1,
		name: 'text'
	}]
},{
	data: {
		text: [''] // Enonified away
	},
	fields: [{
		min: 1,
		name: 'text'
	}]
},{
	// No data param
	fields: [{
		min: 2,
		name: 'text'
	}]
},{
	data: {},
	fields: [{
		min: 2,
		name: 'text'
	}]
},{
	data: {
		text: 'a'
	},
	fields: [{
		min: 2,
		name: 'text'
	}]
},{
	data: {
		text: []
	},
	fields: [{
		min: 2,
		name: 'text'
	}]
},{
	data: {
		text: ['a']
	},
	fields: [{
		min: 2,
		name: 'text'
	}]
}/*,{
	data: {
		text: ['a', ''] // Enonify doesn't remove empty string from array?
	},
	fields: [{
		min: 2,
		name: 'text'
	}]
}*/];


function toStr(v) { return JSON.stringify(v); }


describe('document', () => {
	describe('validateOccurrences()', () => {
		describe('--> true', () => {
			TESTS_VALID.forEach((params) => {
				it(`${toStr(params)}`, () => {
					deepStrictEqual(
						true,
						validateOccurrences(params/*, {log}*/)
					);
				});
			});
		});
		describe('--> false', () => {
			TESTS_INVALID.forEach((params) => {
				it(`${toStr(params)}`, () => {
					deepStrictEqual(
						false,
						validateOccurrences(params/*, {log}*/)
					);
				});
			});
		});
	}); // describe validateOccurrences()
}); // describe document
