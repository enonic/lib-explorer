import type { send } from '@enonic-types/lib-event';
import type { connect } from '@enonic-types/lib-node';
import type { DocumentTypeFieldsObject } from '/lib/explorer/types/';


import {
	LibEvent,
	LibNode,
	Log,
	Server
} from '@enonic/mock-xp';
import {
    describe,
    expect,
    jest,
    test as it
} from '@jest/globals';
import { FieldPath } from '@enonic/explorer-utils';
import { addExtraFieldsToDocumentType } from './addExtraFieldsToDocumentType';
import { constrainPropertyNames } from './constrainPropertyNames';
import { fieldsArrayToObj } from './field';
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
} from '../../../../../../test/fields';
import {
	BOOLEANS,
	DOCUMENT_TYPE,
	DOCUMENT_TYPES_FOLDER,
	DOCUMENT_TYPES_FOLDER_PATH,
	STRINGS
} from '../../../../../../test/testData';


const server = new Server({
	loglevel: 'silent'
}).createRepo({
	id: 'com.enonic.app.explorer'
});

// eslint-disable-next-line @typescript-eslint/no-namespace
declare module globalThis {
	let log: Log
}

globalThis.log = server.log;

const libEvent = new LibEvent({
	server
});

const libNode = new LibNode({
	server
});

jest.mock('/lib/xp/event', () => {
	return {
		send: jest.fn<typeof send>((event) => libEvent.send(event)),
	}
}, { virtual: true });

jest.mock('/lib/xp/node', () => {
	return {
		connect: jest.fn<typeof connect>((params) => libNode.connect(params)),
	}
}, { virtual: true });

const connection = libNode.connect({
	branch: 'master',
	repoId: 'com.enonic.app.explorer',
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
				}),
				documentTypeId: CREATED_DOCUMENT_TYPE_NODE._id,
				fieldsObj
			});
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
			expect(actual).toStrictEqual(expected);
		}); // it

		it(`doesn't make an entry per item in an array`, () => {
			expect(addExtraFieldsToDocumentType({
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
				}),
				documentTypeId: CREATED_DOCUMENT_TYPE_NODE._id,
				fieldsObj: {}
			})).toStrictEqual({
				myarray: FIELD_STRING,
				myobjarray: FIELD_SET,
				'myobjarray.key': FIELD_STRING
			});
		});
		it(`doesn't make an entry per item in an GeoPointArray`, () => {
			const newDocumentTypeNode = connection.create({
				_name: 'a',
				_path: `${DOCUMENT_TYPES_FOLDER_PATH}/a`,
				properties: []
			});
			// log.debug('newDocumentTypeNode:%s', newDocumentTypeNode);

			const fieldsObj = fieldsArrayToObj(newDocumentTypeNode['properties'] || []);
			// log.debug('fieldsObj:%s', fieldsObj);

			expect(addExtraFieldsToDocumentType({
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
				}),
				documentTypeId: newDocumentTypeNode._id,
				fieldsObj
			})).toStrictEqual({
				mygeopointarray: FIELD_GEO_POINT,
				mygeopointarrayarray: FIELD_GEO_POINT
			});
		}); // it
		it('Makes fields for children in an array of sets', () => {
			const emptyDocumentTypeNode = connection.create({
				_name: 'b',
				_path: `${DOCUMENT_TYPES_FOLDER_PATH}/b`,
				properties: []
			});
			// log.debug('newDocumentTypeNode:%s', newDocumentTypeNode);

			const fieldsObj = fieldsArrayToObj(emptyDocumentTypeNode['properties'] || []);
			// log.debug('fieldsObj:%s', fieldsObj);

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

			expect(addExtraFieldsToDocumentType({
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
				}),
				documentTypeId: emptyDocumentTypeNode._id,
				fieldsObj
			})).toStrictEqual(expected);
			expect(addExtraFieldsToDocumentType({
				data: constrainPropertyNames({
					data: {
						_id: '_id',
						_name: '_name',
						_path: '_path',
						_versionKey: '_versionKey',
						oneOrMoreSets: setWithSingleValues
					}
				}),
				documentTypeId: emptyDocumentTypeNode._id,
				fieldsObj
			})).toStrictEqual(expected);
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
			// log.debug('documentTypeNodeWithSetWithOneProperty:%s', documentTypeNodeWithSetWithOneProperty);

			const fieldsObj = fieldsArrayToObj(documentTypeNodeWithSetWithOneProperty['properties'] || []);
			// log.debug('fieldsObj:%s', fieldsObj);

			expect(addExtraFieldsToDocumentType({
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
				}),
				documentTypeId: documentTypeNodeWithSetWithOneProperty._id,
				fieldsObj
			})).toStrictEqual({
				oneormoresets: FIELD_SET,
				'oneormoresets.oneormorebooleans': FIELD_BOOLEAN,
				'oneormoresets.oneormorestrings': FIELD_STRING
			});
		}); // it
		// TODO Empty arrays
		// TODO Arrays with first item undefined or ''
	}); // describe addExtraFieldsToDocumentType
}); // describe document
