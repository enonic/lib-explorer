import type { JavaBridge as JavaBridgeWithStemmingLanguageFromLocale } from '../../../../src/main/resources/lib/explorer/_coupling/types';
import type { DocumentTypeFieldsObject } from '/lib/explorer/types/';


import {JavaBridge} from '@enonic/mock-xp';
import {deepStrictEqual} from 'assert';
import { FieldPath } from '@enonic/explorer-utils';
import { cleanData } from '../../../../src/main/resources/lib/explorer/_uncoupled/document/cleanData';
import {log} from '../../../dummies';


const javaBridge = new JavaBridge({
	app: {
		config: {},
		name: 'com.enonic.app.explorer',
		version: '0.0.1-SNAPSHOT'
	},
	log
}) as unknown as JavaBridgeWithStemmingLanguageFromLocale;


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
				}, javaBridge)
			);
		});
	}); // describe cleanData
}); // describe document
