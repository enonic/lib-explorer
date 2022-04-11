import {VALUE_TYPE_BOOLEAN} from '@enonic/js-utils/dist/cjs/storage/indexing/valueType/constants';
import {JavaBridge} from '@enonic/mock-xp';
import {deepStrictEqual} from 'assert';

import {
	FIELD_PATH_GLOBAL,
	FIELD_PATH_META,
	document
} from '../../../../build/rollup/index.js';
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

const {
	addExtraFieldsToDocumentType,
	fieldsArrayToObj
} = document;

const javaBridge = new JavaBridge({
	app: {
		config: {},
		name: 'com.enonic.app.explorer',
		version: '0.0.1-SNAPSHOT'
	},
	log
});
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
				myString: {
					valueType: 'string'
				}
			};
			deepStrictEqual(
				{
					myString: {
						//active: true,
						valueType: 'string'
					},
					myObject: FIELD_SET,
					'myObject.myBoolean': FIELD_BOOLEAN,
					'myObject.myDateObj': FIELD_INSTANT,
					'myObject.myGeoPointArray': FIELD_GEO_POINT,
					'myObject.myGeoPointString': FIELD_GEO_POINT,
					'myObject.myInstantString': FIELD_INSTANT,
					'myObject.myLocalDateString': FIELD_LOCAL_DATE,
					'myObject.myLocalDateTimeString': FIELD_LOCAL_DATE_TIME,
					'myObject.myLocalTimeString': FIELD_LOCAL_TIME,
					'myObject.myNumber': FIELD_DOUBLE,
					'myObject.myString': FIELD_STRING
				},
				addExtraFieldsToDocumentType({
					data: {
						_id: '_id',
						_name: '_name',
						_path: '_path',
						_versionKey: '_versionKey',
						[FIELD_PATH_GLOBAL]: `${FIELD_PATH_GLOBAL}`,
						[FIELD_PATH_META]: `${FIELD_PATH_META}`,
						myString: 'myString',
						myObject
					},
					documentTypeId: CREATED_DOCUMENT_TYPE_NODE._id,
					fieldsObj
				}, javaBridge)
			);
		}); // it
		it(`doesn't make an entry per item in an array`, () => {
			deepStrictEqual(
				{
					myArray: FIELD_STRING,
					myObjArray: FIELD_SET,
					'myObjArray.key': FIELD_STRING
				},
				addExtraFieldsToDocumentType({
					data: {
						_id: '_id',
						_name: '_name',
						_path: '_path',
						_versionKey: '_versionKey',
						//[FIELD_PATH_GLOBAL]: `${FIELD_PATH_GLOBAL}`,
						//[FIELD_PATH_META]: `${FIELD_PATH_META}`,
						myArray: ['one', 'two'],
						myObjArray: [{
							key: 'a'
						},{
							key: 'b'
						}]
					},
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
					myGeoPointArray: FIELD_GEO_POINT,
					myGeoPointArrayArray: FIELD_GEO_POINT
				},
				addExtraFieldsToDocumentType({
					data: {
						_id: '_id',
						_name: '_name',
						_path: '_path',
						_versionKey: '_versionKey',
						//[FIELD_PATH_GLOBAL]: `${FIELD_PATH_GLOBAL}`,
						//[FIELD_PATH_META]: `${FIELD_PATH_META}`,
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
					},
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
				oneOrMoreSets: FIELD_SET,
				'oneOrMoreSets.oneOrMoreBooleans': FIELD_BOOLEAN,
			};

			deepStrictEqual(
				expected,
				addExtraFieldsToDocumentType({
					data: {
						_id: '_id',
						_name: '_name',
						_path: '_path',
						_versionKey: '_versionKey',
						oneOrMoreSets: [
							setWithArrayValues,
							setWithSingleValues
						]
					},
					documentTypeId: emptyDocumentTypeNode._id,
					fieldsObj
				}, javaBridge)
			); // deepStrictEqual
			deepStrictEqual(
				expected,
				addExtraFieldsToDocumentType({
					data: {
						_id: '_id',
						_name: '_name',
						_path: '_path',
						_versionKey: '_versionKey',
						oneOrMoreSets: setWithSingleValues
					},
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
					name: 'oneOrMoreSets'
				}, {
					...FIELD_STRING,
					name: 'oneOrMoreSets.oneOrMoreStrings'
				}]
			});
			//javaBridge.log.debug('documentTypeNodeWithSetWithOneProperty:%s', documentTypeNodeWithSetWithOneProperty);

			const fieldsObj = fieldsArrayToObj(documentTypeNodeWithSetWithOneProperty['properties'] || [], javaBridge);
			//javaBridge.log.debug('fieldsObj:%s', fieldsObj);

			deepStrictEqual(
				{
					oneOrMoreSets: FIELD_SET,
					'oneOrMoreSets.oneOrMoreBooleans': FIELD_BOOLEAN,
					'oneOrMoreSets.oneOrMoreStrings': FIELD_STRING
				},
				addExtraFieldsToDocumentType({
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
					},
					documentTypeId: documentTypeNodeWithSetWithOneProperty._id,
					fieldsObj
				}, javaBridge)
			); // deepStrictEqual
		}); // it
		// TODO Empty arrays
		// TODO Arrays with first item undefined or ''
	}); // describe addExtraFieldsToDocumentType
}); // describe document
