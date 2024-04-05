import {Log, Server} from '@enonic/mock-xp';
import {deepStrictEqual} from 'assert';
import { validateOccurrences } from './validateOccurrences';


const server = new Server({
	loglevel: 'silent'
});

// eslint-disable-next-line @typescript-eslint/no-namespace
declare module globalThis {
	let log: Log
}

globalThis.log = server.log;

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
},{
	data: {
		justOne: 'justOne'
	},
	fields: [{
		max: 1,
		name: 'justOne'
	}]
},{
	data: {
		pair: [1, 2]
	},
	fields: [{
		max: 2,
		name: 'pair'
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
},/*{
	data: {
		text: ['a', ''] // Enonify doesn't remove empty string from array?
	},
	fields: [{
		min: 2,
		name: 'text'
	}]
},*/{
	data: {
		justOne: [1, 2]
	},
	fields: [{
		max: 1,
		name: 'justOne'
	}]
},{
	data: {
		pair: [1, 2, 3]
	},
	fields: [{
		max: 2,
		name: 'pair'
	}]
}];


function toStr(v) { return JSON.stringify(v); }


describe('document', () => {
	describe('validateOccurrences()', () => {
		describe('--> true', () => {
			TESTS_VALID.forEach((params) => {
				it(`${toStr(params)}`, () => {
					deepStrictEqual(
						true,
						validateOccurrences(params)
					);
				});
			});
		});
		describe('--> false', () => {
			TESTS_INVALID.forEach((params) => {
				it(`${toStr(params)}`, () => {
					deepStrictEqual(
						false,
						validateOccurrences(params)
					);
				});
			});
		});
		describe('partial', () => {
			it("complains about required fields (when partial is false)", () => {
				deepStrictEqual(
					false,
					validateOccurrences({
						data: {
							//optional: 'optional',
							//required: 'required', // valid
							//required: ['required'], // also valid
							//pair: [1,2]
						},
						fields:[/*{
							min: 0,
							name: 'optional'
						},*/{
							min: 1,
							name: 'required'
						},{
							min: 2,
							name: 'pair'
						}],
						partial: false // default is false
					})
				); // deepStrictEqual
			}); // it
			it("doesn't complain about required fields (when partial is true)", () => {
				deepStrictEqual(
					true,
					validateOccurrences({
						data: {},
						fields:[{
							min: 0,
							name: 'optional'
						},{
							min: 1,
							name: 'required'
						},{
							min: 2,
							name: 'pair'
						}],
						partial: true
					})
				); // deepStrictEqual
			}); // it
			it("complains about less than minimum (when value provided and partial is true)", () => {
				deepStrictEqual(
					false,
					validateOccurrences({
						data: {
							pair: 'too few'
						},
						fields:[{
							min: 2,
							name: 'pair'
						}],
						partial: true
					})
				); // deepStrictEqual
			}); // it
			it("complains about exceeding maximum (when value provided and partial is true)", () => {
				deepStrictEqual(
					false,
					validateOccurrences({
						data: {
							justOne: [1, 2]
						},
						fields:[{
							max: 1,
							name: 'justOne'
						}],
						partial: true
					})
				); // deepStrictEqual
			}); // it
		}); // describe partial
	}); // describe validateOccurrences()
}); // describe document
