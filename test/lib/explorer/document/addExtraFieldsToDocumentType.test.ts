import {JavaBridge} from '@enonic/js-utils/src/mock/JavaBridge';
import {deepStrictEqual} from 'assert';

import {
	FIELD_PATH_GLOBAL,
	FIELD_PATH_META,
	document
} from '../../../../build/rollup/index.js';
import {
	DOCUMENT_TYPE,
	DOCUMENT_TYPES_FOLDER,
	DOCUMENT_TYPES_FOLDER_PATH
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
						valueType: 'string'
					},
					myObject: {
						enabled: true,
						fulltext: false,
						includeInAllText: false,
						max: 0,
						min: 0,
						nGram: false,
						path: false,
						valueType: 'set'
					},
					'myObject.myBoolean': {
						enabled: true,
						fulltext: false,
						includeInAllText: false,
						max: 0,
						min: 0,
						nGram: false,
						path: false,
						valueType: 'boolean'
					},
					'myObject.myDateObj': {
						enabled: true,
						fulltext: false,
						includeInAllText: false,
						max: 0,
						min: 0,
						nGram: false,
						path: false,
						valueType: 'instant'
					},
					'myObject.myGeoPointArray': {
						enabled: true,
						fulltext: false,
						includeInAllText: false,
						max: 0,
						min: 0,
						nGram: false,
						path: false,
						valueType: 'geoPoint'
					},
					'myObject.myGeoPointString': {
						enabled: true,
						fulltext: false,
						includeInAllText: false,
						max: 0,
						min: 0,
						nGram: false,
						path: false,
						valueType: 'geoPoint'
					},
					'myObject.myInstantString': {
						enabled: true,
						fulltext: false,
						includeInAllText: false,
						max: 0,
						min: 0,
						nGram: false,
						path: false,
						valueType: 'instant'
					},
					'myObject.myLocalDateString': {
						enabled: true,
						fulltext: false,
						includeInAllText: false,
						max: 0,
						min: 0,
						nGram: false,
						path: false,
						valueType: 'localDate'
					},
					'myObject.myLocalDateTimeString': {
						enabled: true,
						fulltext: false,
						includeInAllText: false,
						max: 0,
						min: 0,
						nGram: false,
						path: false,
						valueType: 'localDateTime'
					},
					'myObject.myLocalTimeString': {
						enabled: true,
						fulltext: false,
						includeInAllText: false,
						max: 0,
						min: 0,
						nGram: false,
						path: false,
						valueType: 'localTime'
					},
					'myObject.myNumber': {
						enabled: true,
						fulltext: false,
						includeInAllText: false,
						max: 0,
						min: 0,
						nGram: false,
						path: false,
						valueType: 'double'
					},
					'myObject.myString': {
						enabled: true,
						fulltext: false,
						includeInAllText: false,
						max: 0,
						min: 0,
						nGram: false,
						path: false,
						valueType: 'string'
					}
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
					myArray: {
						enabled: true,
						fulltext: false,
						includeInAllText: false,
						max: 0,
						min: 0,
						nGram: false,
						path: false,
						valueType: 'string'
					},
					myObjArray: {
						enabled: true,
						fulltext: false,
						includeInAllText: false,
						max: 0,
						min: 0,
						nGram: false,
						path: false,
						valueType: 'set'
					}
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
					myGeoPointArray: {
						enabled: true,
						fulltext: false,
						includeInAllText: false,
						max: 0,
						min: 0,
						nGram: false,
						path: false,
						valueType: 'geoPoint'
					},
					myGeoPointString: {
						enabled: true,
						fulltext: false,
						includeInAllText: false,
						max: 0,
						min: 0,
						nGram: false,
						path: false,
						valueType: 'geoPoint'
					}
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
						myGeoPointString: '59.9090442,10.7423389'
					},
					documentTypeId: newDocumentTypeNode._id,
					fieldsObj
				}, javaBridge)
			);
			/*const documentTypeNodeAfter = connection.get(newDocumentTypeNode._id);
			javaBridge.log.debug('documentTypeNodeAfter:%s', documentTypeNodeAfter);

			addExtraFieldsToDocumentType({
				data: {
					_id: '_id',
					_name: '_name',
					_path: '_path',
					_versionKey: '_versionKey',
					//[FIELD_PATH_GLOBAL]: `${FIELD_PATH_GLOBAL}`,
					//[FIELD_PATH_META]: `${FIELD_PATH_META}`,
					myGeoPointString: [
						59.9090442,
						10.7423389
					],
					myGeoPointArray: '59.9090442,10.7423389'
				},
				documentTypeId: newDocumentTypeNode._id,
				fieldsObj
			}, javaBridge);

			const documentTypeNodeAgain = connection.get(newDocumentTypeNode._id);
			javaBridge.log.debug('documentTypeNodeAgain:%s', documentTypeNodeAgain);*/
		});
	}); // describe addExtraFieldsToDocumentType
}); // describe document
