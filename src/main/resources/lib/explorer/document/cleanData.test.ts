import type { DocumentTypeFieldsObject } from '/lib/explorer/types/';


import {
	Log,
	Server
} from '@enonic/mock-xp';
import { deepStrictEqual } from 'assert';
import { FieldPath } from '@enonic/explorer-utils';
import { cleanData } from './cleanData';


const server = new Server({
	loglevel: 'silent'
});

// eslint-disable-next-line @typescript-eslint/no-namespace
declare module globalThis {
	let log: Log
}

globalThis.log = server.log;

describe('document', () => {
	describe('cleanData()', () => {
		it(`cleanData() removes ${FieldPath.GLOBAL} and ${FieldPath.META}`, () => {
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
						[FieldPath.GLOBAL]: `${FieldPath.GLOBAL}`,
						[FieldPath.META]: `${FieldPath.META}`,
						myString: 'myString',
						myObject: {
							myProperty: 'myObject.myProperty'
						}
					}
				})
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
						[FieldPath.GLOBAL]: `${FieldPath.GLOBAL}`,
						[FieldPath.META]: `${FieldPath.META}`,
						myString: 'myString',
						myObject: {
							myProperty: 'myObject.myProperty'
						}
					},
					fieldsObj: {
						'myString': {
							valueType: 'string'
						}
					} as unknown as DocumentTypeFieldsObject
				})
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
						[FieldPath.GLOBAL]: `${FieldPath.GLOBAL}`,
						[FieldPath.META]: `${FieldPath.META}`,
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
					} as unknown as DocumentTypeFieldsObject
				})
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
						[FieldPath.GLOBAL]: `${FieldPath.GLOBAL}`,
						[FieldPath.META]: `${FieldPath.META}`,
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
					} as unknown as DocumentTypeFieldsObject
				})
			);
		});
	}); // describe cleanData
}); // describe document
