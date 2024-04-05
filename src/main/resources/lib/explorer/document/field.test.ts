import type {
	DocumentTypeField,
	DocumentTypeFields,
	DocumentTypeFieldsObject
} from '/lib/explorer/types/';


import {
	Log,
	Server
} from '@enonic/mock-xp';
import {toStr} from '@enonic/js-utils/value/toStr';
import {
	deepStrictEqual,
	throws
} from 'assert';
import {
	addMissingSetToFieldsArray,
	applyDefaultsToField,
	fieldsArrayToObj,
	fieldsObjToArray,
	isField,
	isFields
} from './field';


const server = new Server({
	loglevel: 'silent'
});

// eslint-disable-next-line @typescript-eslint/no-namespace
declare module globalThis {
	let log: Log
}

globalThis.log = server.log;

//function toStr(v :unknown) { return JSON.stringify(v); }


const FIELDS_VALID = [{
	// Empty
},{
	active: true,
	enabled: true,
	fulltext: false,
	includeInAllText: false,
	max: 0,
	min: 0,
	//name: 'name', // Borks one test
	nGram: false,
	path: false,
	stemmed: false,
	valueType: 'string'
}];

const FIELDS_INVALID = [{
	invalidName: 'value'
}, {
	enabled: 'notBoolean'
}, {
	fulltext: 'notBoolean'
}, {
	includeInAllText: 'notBoolean'
}, {
	nGram: 'notBoolean'
}, {
	path: 'notBoolean'
}, {
	max: 'notPositiveInteger'
}, {
	min: -1
}, {
	name: 0 // Not string
}, {
	valueType: 'notValidValueType'
}];


const TESTS = [[
	[], {}
], [
	[{name: 'a'}], {
		a: {
			active: true,
			enabled: true,
			fulltext: false,
			includeInAllText: false,
			max: 0,
			min: 0,
			nGram: false,
			path: false,
			stemmed: false,
			valueType: 'string'
		}
	}
], [
	[{name: 'a'},{
		active: true,
		enabled: false,
		fulltext: true,
		includeInAllText: true,
		max: 1,
		min: 1,
		name: 'b',
		nGram: true,
		path: true,
		stemmed: false,
		valueType: 'boolean'
	}], {
		a: {
			active: true,
			enabled: true,
			fulltext: false,
			includeInAllText: false,
			max: 0,
			min: 0,
			nGram: false,
			path: false,
			stemmed: false,
			valueType: 'string'
		},
		b: {
			active: true,
			enabled: false,
			fulltext: true,
			includeInAllText: true,
			max: 1,
			min: 1,
			nGram: true,
			path: true,
			stemmed: false,
			valueType: 'boolean'
		}
	}
]];


describe('document', () => {
	describe('isField()', () => {
		describe('--> true', () => {
			for (var i = 0; i < FIELDS_VALID.length; i++) {
				const field = FIELDS_VALID[i]
				it(`${toStr(field)}`, () => {
					deepStrictEqual(
						isField(field),
						true
					);
				});
			} // for
		});
		describe('--> false', () => {
			for (var i = 0; i < FIELDS_INVALID.length; i++) {
				const field = FIELDS_INVALID[i]
				it(`${toStr(field)}`, () => {
					deepStrictEqual(
						isField(field),
						false
					);
				});
			} // for
		});
	});
	describe('isFields()', () => {
		describe('--> true', () => {
			it(`${toStr(FIELDS_VALID)}`, () => {
				deepStrictEqual(
					isFields(FIELDS_VALID),
					true
				);
			});
		});
		describe('--> false', () => {
			it(`${toStr(FIELDS_INVALID)}`, () => {
				deepStrictEqual(
					isFields(FIELDS_INVALID),
					false
				);
			});
		});
	});
	describe('applyDefaultsToField()', () => {
		describe('--> true', () => {
			for (var i = 0; i < FIELDS_VALID.length; i++) {
				const field = FIELDS_VALID[i]
				it(`${toStr(field)}`, () => {
					deepStrictEqual(
						applyDefaultsToField(field),
						FIELDS_VALID[1]
					);
				});
			} // for
		});
		describe('--> throws', () => {
			for (var i = 0; i < FIELDS_INVALID.length; i++) {
				const field = FIELDS_INVALID[i] as Partial<DocumentTypeField>;
				it(`${toStr(field)}`, () => {
					throws(
						() => applyDefaultsToField(field),
						{
							name: 'TypeError'
						}
					);
				});
			} // for
		});
	});
	describe('fieldsArrayToObj()', () => {
		for (var i = 0; i < TESTS.length; i++) {
			const [fields, expected] = TESTS[i]
			it(`${toStr(fields)}`, () => {
				deepStrictEqual(
					fieldsArrayToObj(fields as DocumentTypeFields),
					expected
				);
			});
		} // for
		describe('--> throws', () => {
			for (var i = 0; i < FIELDS_INVALID.length; i++) {
				const fields = FIELDS_INVALID[i] as unknown as DocumentTypeFields;
				it(`${toStr(fields)}`, () => {
					throws(
						() => fieldsArrayToObj(fields),
						{
							message: /fieldsArrayToObj: fields not of type Fields/,
							name: 'TypeError'
						}
					);
				});
			} // for
		});
	});
	describe('fieldsObjToArray()', () => {
		const fieldsObj = {
			myString: {
				valueType: 'string'
			}
		} as unknown as DocumentTypeFieldsObject;
		it(`${toStr(fieldsObj)}`, () => {
			const expected = [{
				active: true,
				enabled: true,
				fulltext: false,
				includeInAllText: false,
				max: 0,
				min: 0,
				nGram: false,
				name: 'myString',
				path: false,
				stemmed: false,
				valueType: 'string'
			}];
			deepStrictEqual(
				fieldsObjToArray(fieldsObj),
				expected
			);
		});
	});
	describe('addMissingSetToFieldsArray()', () => {
		it('adds missing nested set in a sorted manner', () => {
			const expected = [{ // fieldsWithMissingSetsAdded
				active: true,
				enabled: true,
				fulltext: false,
				includeInAllText: false,
				max: 0,
				min: 0,
				name: 'obj',
				nGram: false,
				path: false,
				stemmed: false,
				valueType: 'set'
			},{
				active: true,
				enabled: true,
				fulltext: false,
				includeInAllText: false,
				max: 0,
				min: 0,
				name: 'obj.first',
				nGram: false,
				path: false,
				stemmed: false,
				valueType: 'set'
			},{
				// enabled: true,
				// fulltext: false,
				// includeInAllText: falsem
				// max: 0,
				// min: 0,
				name: 'obj.first.second',
				// nGram: false,
				// path: false,
				valueType: 'string'
			}];
			deepStrictEqual(
				addMissingSetToFieldsArray([{
					name: 'obj.first.second',
					valueType: 'string'
				}]),
				expected
			); // deepStrictEqual
		}); // it
	}); // describe addMissingSetToFieldsArray
}); // describe document
