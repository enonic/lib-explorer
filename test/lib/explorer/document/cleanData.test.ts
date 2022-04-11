import {JavaBridge} from '@enonic/mock-xp';
import {deepStrictEqual} from 'assert';

import {
	FIELD_PATH_GLOBAL,
	FIELD_PATH_META,
	document
} from '../../../../build/rollup/index.js';
// Currently swc doesn't bundle, so import paths need to be relative to where the output file gets placed.
// I don't think swc does dedup either, so it can't rewrite import paths.
// I haven't found a way for mocha to resolve require paths either.
import {log} from '../../../dummies';


const {cleanData} = document;


const javaBridge = new JavaBridge({
	app: {
		config: {},
		name: 'com.enonic.app.explorer',
		version: '0.0.1-SNAPSHOT'
	},
	log
});

describe('document', () => {
	describe('cleanData()', () => {
		it(`cleanData() removes ${FIELD_PATH_GLOBAL} and ${FIELD_PATH_META}`, () => {
			deepStrictEqual(
				{
					_id: '_id',
					_name: '_name',
					_path: '_path',
					_versionKey: '_versionKey',
					myString: 'myString',
					myObject: {
						myProperty: 'myObject.myProperty'
					}
				},
				cleanData({
					data: {
						_id: '_id',
						_name: '_name',
						_path: '_path',
						_versionKey: '_versionKey',
						[FIELD_PATH_GLOBAL]: `${FIELD_PATH_GLOBAL}`,
						[FIELD_PATH_META]: `${FIELD_PATH_META}`,
						myString: 'myString',
						myObject: {
							myProperty: 'myObject.myProperty'
						}
					}
				}, javaBridge)
			);
		}); // it

		it(`cleanData({cleanExtraFields: true}) removes myObject`, () => {
			deepStrictEqual(
				{
					_id: '_id',
					_name: '_name',
					_path: '_path',
					_versionKey: '_versionKey',
					myString: 'myString'
				},
				cleanData({
					cleanExtraFields: true,
					data: {
						_id: '_id',
						_name: '_name',
						_path: '_path',
						_versionKey: '_versionKey',
						[FIELD_PATH_GLOBAL]: `${FIELD_PATH_GLOBAL}`,
						[FIELD_PATH_META]: `${FIELD_PATH_META}`,
						myString: 'myString',
						myObject: {
							myProperty: 'myObject.myProperty'
						}
					},
					fieldsObj: {
						'myString': {
							valueType: 'string'
						}
					}
				}, javaBridge)
			);
		});

		it(`cleanData({cleanExtraFields: true}) removes myObject.myProperty`, () => {
			deepStrictEqual(
				{
					_id: '_id',
					_name: '_name',
					_path: '_path',
					_versionKey: '_versionKey',
					myString: 'myString',
					myObject: {}
				},
				cleanData({
					cleanExtraFields: true,
					data: {
						_id: '_id',
						_name: '_name',
						_path: '_path',
						_versionKey: '_versionKey',
						[FIELD_PATH_GLOBAL]: `${FIELD_PATH_GLOBAL}`,
						[FIELD_PATH_META]: `${FIELD_PATH_META}`,
						myString: 'myString',
						myObject: {
							myProperty: {
								myNestedProperty: 'myNestedPropertyValue'
							}
						}
					},
					fieldsObj: {
						'myString': {
							valueType: 'string'
						},
						'myObject': {
							valueType: 'set'
						}
					}
				}, javaBridge)
			);
		});

		it(`cleanData({cleanExtraFields: true}) removes myObject.myProperty.myNestedProperty`, () => {
			deepStrictEqual(
				{
					_id: '_id',
					_name: '_name',
					_path: '_path',
					_versionKey: '_versionKey',
					myString: 'myString',
					myObject: {
						myProperty: {}
					}
				},
				cleanData({
					cleanExtraFields: true,
					data: {
						_id: '_id',
						_name: '_name',
						_path: '_path',
						_versionKey: '_versionKey',
						[FIELD_PATH_GLOBAL]: `${FIELD_PATH_GLOBAL}`,
						[FIELD_PATH_META]: `${FIELD_PATH_META}`,
						myString: 'myString',
						myObject: {
							myProperty: {
								myNestedProperty: 'myNestedPropertyValue'
							}
						}
					},
					fieldsObj: {
						'myString': {
							valueType: 'string'
						},
						'myObject': {
							valueType: 'set'
						},
						'myObject.myProperty': {
							valueType: 'set'
						}
					}
				}, javaBridge)
			);
		});
	}); // describe cleanData
}); // describe document
