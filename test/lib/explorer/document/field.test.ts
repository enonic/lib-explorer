import {JavaBridge} from '@enonic/js-utils/src/mock/JavaBridge';
import {toStr} from '@enonic/js-utils/src';
import {
	deepStrictEqual,
	throws
} from 'assert';

import {
	document
} from '../../../../build/rollup/index.js';
import {log} from '../../../dummies';

const {
	addMissingSetToFieldsArray,
	applyDefaultsToField,
	fieldsArrayToObj,
	fieldsObjToArray,
	isField,
	isFields
} = document;

const javaBridge = new JavaBridge({
	app: {
		config: {},
		name: 'com.enonic.app.explorer',
		version: '0.0.1-SNAPSHOT'
	},
	log
});

//function toStr(v :unknown) { return JSON.stringify(v); }


const FIELDS_VALID = [{
	// Empty
},{
	enabled: true,
	fulltext: false,
	includeInAllText: false,
	max: 0,
	min: 0,
	//name: 'name', // Borks one test
	nGram: false,
	path: false,
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
			enabled: true,
			fulltext: false,
			includeInAllText: false,
			max: 0,
			min: 0,
			nGram: false,
			path: false,
			valueType: 'string'
		}
	}
], [
	[{name: 'a'},{
		enabled: false,
		fulltext: true,
		includeInAllText: true,
		max: 1,
		min: 1,
		name: 'b',
		nGram: true,
		path: true,
		valueType: 'boolean'
	}], {
		a: {
			enabled: true,
			fulltext: false,
			includeInAllText: false,
			max: 0,
			min: 0,
			nGram: false,
			path: false,
			valueType: 'string'
		},
		b: {
			enabled: false,
			fulltext: true,
			includeInAllText: true,
			max: 1,
			min: 1,
			nGram: true,
			path: true,
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
						true,
						isField(field, javaBridge)
					);
				});
			} // for
		});
		describe('--> false', () => {
			for (var i = 0; i < FIELDS_INVALID.length; i++) {
				const field = FIELDS_INVALID[i]
				it(`${toStr(field)}`, () => {
					deepStrictEqual(
						false,
						isField(field, javaBridge)
					);
				});
			} // for
		});
	});
	describe('isFields()', () => {
		describe('--> true', () => {
			it(`${toStr(FIELDS_VALID)}`, () => {
				deepStrictEqual(
					true,
					isFields(FIELDS_VALID, javaBridge)
				);
			});
		});
		describe('--> false', () => {
			it(`${toStr(FIELDS_INVALID)}`, () => {
				deepStrictEqual(
					false,
					isFields(FIELDS_INVALID, javaBridge)
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
						FIELDS_VALID[1],
						applyDefaultsToField(field, javaBridge)
					);
				});
			} // for
		});
		describe('--> throws', () => {
			for (var i = 0; i < FIELDS_INVALID.length; i++) {
				const field = FIELDS_INVALID[i]
				it(`${toStr(field)}`, () => {
					throws(
						() => applyDefaultsToField(field, javaBridge),
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
					expected,
					fieldsArrayToObj(fields, javaBridge)
				);
			});
		} // for
		describe('--> throws', () => {
			for (var i = 0; i < FIELDS_INVALID.length; i++) {
				const field = FIELDS_INVALID[i]
				it(`${toStr(field)}`, () => {
					throws(
						() => fieldsArrayToObj(field, javaBridge),
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
		};
		it(`${toStr(fieldsObj)}`, () => {
			deepStrictEqual(
				[{
					enabled: true,
					fulltext: false,
					includeInAllText: false,
					max: 0,
					min: 0,
					nGram: false,
					name: 'myString',
					path: false,
					valueType: 'string'
				}],
				fieldsObjToArray(fieldsObj, javaBridge)
			);
		});
	});
	describe('addMissingSetToFieldsArray()', () => {
		it('adds missing nested set in a sorted manner', () => {
			deepStrictEqual(
				[{
					enabled: true,
					fulltext: false,
					includeInAllText: false,
					max: 0,
					min: 0,
					name: 'obj',
					nGram: false,
					path: false,
					valueType: 'set'
				},{
					enabled: true,
					fulltext: false,
					includeInAllText: false,
					max: 0,
					min: 0,
					name: 'obj.first',
					nGram: false,
					path: false,
					valueType: 'set'
				},{
					//enabled: true,
					//fulltext: false,
					//includeInAllText: falsem
					//max: 0,
					//min: 0,
					name: 'obj.first.second',
					//nGram: false,
					//path: false,
					valueType: 'string'
				}], // fieldsWithMissingSetsAdded
				addMissingSetToFieldsArray([{
					name: 'obj.first.second',
					valueType: 'string'
				}], javaBridge)
			); // deepStrictEqual
		}); // it
	}); // describe addMissingSetToFieldsArray
}); // describe document
