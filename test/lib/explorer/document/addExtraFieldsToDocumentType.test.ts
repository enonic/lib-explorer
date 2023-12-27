import type { JavaBridge as JavaBridgeWithStemmingLanguageFromLocale } from '../../../../src/main/resources/lib/explorer/_coupling/types';
import type { DocumentTypeFieldsObject } from '/lib/explorer/types/';


import { VALUE_TYPE_BOOLEAN } from '@enonic/js-utils/storage/indexing/valueType/constants';
import { JavaBridge } from '@enonic/mock-xp';
import { deepStrictEqual } from 'assert';
import { FieldPath } from '@enonic/explorer-utils';
import { addExtraFieldsToDocumentType } from '../../../../src/main/resources/lib/explorer/_uncoupled/document/addExtraFieldsToDocumentType';
import { constrainPropertyNames } from '../../../../src/main/resources/lib/explorer/_uncoupled/document/constrainPropertyNames';
import { fieldsArrayToObj } from '../../../../src/main/resources/lib/explorer/_uncoupled/document/field';
import {
	FIELD_BOOLEAN,
	FIELD_DOUBLE,
	FIELD_GEO_POINT,
	FIELD_INSTANT,
	FIELD_LOCAL_DATE,
	FIELD_LOCAL_DATE_TIME,
	FIELD_LOCAL_TIME,
	FIELD_SET,
	FIELD_STRING
} from '../../../fields';
import {
	BOOLEANS,
	DOCUMENT_TYPE,
	DOCUMENT_TYPES_FOLDER,
	DOCUMENT_TYPES_FOLDER_PATH,
	STRINGS
} from '../../../testData';
import {log} from '../../../dummies';


const javaBridge = new JavaBridge({
	app: {
		config: {},
		name: 'com.enonic.app.explorer',
		version: '0.0.1-SNAPSHOT'
	},
	log
}) as unknown as JavaBridgeWithStemmingLanguageFromLocale;
javaBridge.repo.create({
	id: 'com.enonic.app.explorer'
});
const connection = javaBridge.connect({
	repoId: 'com.enonic.app.explorer',
	branch: 'master'
});
connection.create(DOCUMENT_TYPES_FOLDER);
const CREATED_DOCUMENT_TYPE_NODE = connection.create(DOCUMENT_TYPE);

describe('document', () => {
	describe('addExtraFieldsToDocumentType()', () => {

		it(`handles all valueTypes`, () => {
			const myObject = {
				myBoolean: true,
				myDateObj: new Date(),
				myGeoPointArray: [59.9090442,10.7423389],
				myGeoPointString: '59.9090442,10.7423389',
				myInstantString: '2011-12-03T10:15:30.123456789Z',
				myLocalDateString: '2011-12-03',
				myLocalDateTimeString:'0000-01-01T00:00:00.000000000',
				myLocalTimeString: '00:00:00.123456789',
				myNumber: 0,
				myString: 'string'
			};
			const fieldsObj = {
				mystring: {
					valueType: 'string'
				}
			} as unknown as DocumentTypeFieldsObject;
			const actual = addExtraFieldsToDocumentType({
				data: constrainPropertyNames({
					data: {
						_id: '_id',
						_name: '_name',
						_path: '_path',
						_versionKey: '_versionKey',
						[FieldPath.GLOBAL]: `${FieldPath.GLOBAL}`,
						[FieldPath.META]: `${FieldPath.META}`,
						myString: 'myString',
						myObject
					}
				}, javaBridge),
				documentTypeId: CREATED_DOCUMENT_TYPE_NODE._id,
				fieldsObj
			}, javaBridge);
			const expected = {
				mystring: {
					// active: true,
					valueType: 'string'
				},
				myobject: FIELD_SET,
				'myobject.myboolean': FIELD_BOOLEAN,
				'myobject.mydateobj': FIELD_INSTANT,
				'myobject.mygeopointarray': FIELD_GEO_POINT,
				'myobject.mygeopointstring': FIELD_GEO_POINT,
				'myobject.myinstantstring': FIELD_INSTANT,
				'myobject.mylocaldatestring': FIELD_LOCAL_DATE,
				'myobject.mylocaldatetimestring': FIELD_LOCAL_DATE_TIME,
				'myobject.mylocaltimestring': FIELD_LOCAL_TIME,
				'myobject.mynumber': FIELD_DOUBLE,
				'myobject.mystring': FIELD_STRING
			};
			deepStrictEqual(actual, expected);
		}); // it

		it(`doesn't make an entry per item in an array`, () => {
			deepStrictEqual(
				{
					myarray: FIELD_STRING,
					myobjarray: FIELD_SET,
					'myobjarray.key': FIELD_STRING
				},
				addExtraFieldsToDocumentType({
					data: constrainPropertyNames({
						data: {
							_id: '_id',
							_name: '_name',
							_path: '_path',
							_versionKey: '_versionKey',
							//[FieldPath.GLOBAL]: `${FieldPath.GLOBAL}`,
							//[FieldPath.META]: `${FieldPath.META}`,
							myArray: ['one', 'two'],
							myObjArray: [{
								key: 'a'
							},{
								key: 'b'
							}]
						}
					}, javaBridge),
					documentTypeId: CREATED_DOCUMENT_TYPE_NODE._id,
					fieldsObj: {}
				}, javaBridge)
			);
		});
		it(`doesn't make an entry per item in an GeoPointArray`, () => {
			const newDocumentTypeNode = connection.create({
				_name: 'a',
				_path: `${DOCUMENT_TYPES_FOLDER_PATH}/a`,
				properties: []
			});
			//javaBridge.log.debug('newDocumentTypeNode:%s', newDocumentTypeNode);

			const fieldsObj = fieldsArrayToObj(newDocumentTypeNode['properties'] || [], javaBridge);
			//javaBridge.log.debug('fieldsObj:%s', fieldsObj);

			deepStrictEqual(
				{
					mygeopointarray: FIELD_GEO_POINT,
					mygeopointarrayarray: FIELD_GEO_POINT
				},
				addExtraFieldsToDocumentType({
					data: constrainPropertyNames({
						data: {
							_id: '_id',
							_name: '_name',
							_path: '_path',
							_versionKey: '_versionKey',
							//[FieldPath.GLOBAL]: `${FieldPath.GLOBAL}`,
							//[FieldPath.META]: `${FieldPath.META}`,
							myGeoPointArray: [
								59.9090442,
								10.7423389
							],
							myGeoPointArrayArray: [[
								-90,
								-180
							],[
								0,
								0
							],[
								90,
								180
							]]
						}
					}, javaBridge),
					documentTypeId: newDocumentTypeNode._id,
					fieldsObj
				}, javaBridge)
			); // deepStrictEqual
		}); // it
		it('Makes fields for children in an array of sets', () => {
			const emptyDocumentTypeNode = connection.create({
				_name: 'b',
				_path: `${DOCUMENT_TYPES_FOLDER_PATH}/b`,
				properties: []
			});
			//javaBridge.log.debug('newDocumentTypeNode:%s', newDocumentTypeNode);

			const fieldsObj = fieldsArrayToObj(emptyDocumentTypeNode['properties'] || [], javaBridge);
			//javaBridge.log.debug('fieldsObj:%s', fieldsObj);

			const setWithArrayValues = {
				oneOrMoreBooleans: BOOLEANS,
			};
			const setWithSingleValues = {
				oneOrMoreBooleans: true,
			};

			const expected = {
				oneormoresets: FIELD_SET,
				'oneormoresets.oneormorebooleans': FIELD_BOOLEAN,
			};

			deepStrictEqual(
				expected,
				addExtraFieldsToDocumentType({
					data: constrainPropertyNames({
						data: {
							_id: '_id',
							_name: '_name',
							_path: '_path',
							_versionKey: '_versionKey',
							oneOrMoreSets: [
								setWithArrayValues,
								setWithSingleValues
							]
						}
					}, javaBridge),
					documentTypeId: emptyDocumentTypeNode._id,
					fieldsObj
				}, javaBridge)
			); // deepStrictEqual
			deepStrictEqual(
				expected,
				addExtraFieldsToDocumentType({
					data: constrainPropertyNames({
						data: {
							_id: '_id',
							_name: '_name',
							_path: '_path',
							_versionKey: '_versionKey',
							oneOrMoreSets: setWithSingleValues
						}
					}, javaBridge),
					documentTypeId: emptyDocumentTypeNode._id,
					fieldsObj
				}, javaBridge)
			); // deepStrictEqual
		}); // it
		it('Extends an existing set inside an array of sets', () => {
			const documentTypeNodeWithSetWithOneProperty = connection.create({
				_name: 'c',
				_path: `${DOCUMENT_TYPES_FOLDER_PATH}/c`,
				properties: [{
					...FIELD_SET,
					name: 'oneormoresets'
				}, {
					...FIELD_STRING,
					name: 'oneormoresets.oneormorestrings'
				}]
			});
			//javaBridge.log.debug('documentTypeNodeWithSetWithOneProperty:%s', documentTypeNodeWithSetWithOneProperty);

			const fieldsObj = fieldsArrayToObj(documentTypeNodeWithSetWithOneProperty['properties'] || [], javaBridge);
			//javaBridge.log.debug('fieldsObj:%s', fieldsObj);

			deepStrictEqual(
				{
					oneormoresets: FIELD_SET,
					'oneormoresets.oneormorebooleans': FIELD_BOOLEAN,
					'oneormoresets.oneormorestrings': FIELD_STRING
				},
				addExtraFieldsToDocumentType({
					data: constrainPropertyNames({
						data: {
							_id: '_id',
							_name: '_name',
							_path: '_path',
							_versionKey: '_versionKey',
							oneOrMoreSets: [{
								oneOrMoreBooleans: BOOLEANS,
								oneOrMoreStrings: STRINGS
							}, {
								oneOrMoreBooleans: true,
								oneOrMoreStrings: 'string'
							}]
						}
					}, javaBridge),
					documentTypeId: documentTypeNodeWithSetWithOneProperty._id,
					fieldsObj
				}, javaBridge)
			); // deepStrictEqual
		}); // it
		// TODO Empty arrays
		// TODO Arrays with first item undefined or ''
	}); // describe addExtraFieldsToDocumentType
}); // describe document
