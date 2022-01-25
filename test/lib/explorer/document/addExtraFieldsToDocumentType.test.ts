import {JavaBridge} from '@enonic/js-utils/src/mock/JavaBridge';
import {deepStrictEqual} from 'assert';

import {
	FIELD_PATH_GLOBAL,
	FIELD_PATH_META,
	document
} from '../../../../build/rollup/index.js';
import {log} from '../../../dummies';

const {addExtraFieldsToDocumentType} = document;

const javaBridge = new JavaBridge({
	app: {
		config: {},
		name: 'com.enonic.app.explorer',
		version: '0.0.1-SNAPSHOT'
	},
	log
});

describe('document', () => {
	describe('addExtraFieldsToDocumentType()', () => {
		it(``, () => {
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
					fieldsObj
				}, javaBridge)
			);
		}); // it
	}); // describe addExtraFieldsToDocumentType
}); // describe document
