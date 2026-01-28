import type { send } from '@enonic-types/lib-event';
import type { connect } from '@enonic-types/lib-node';


import {
	VALUE_TYPE_BOOLEAN,
	VALUE_TYPE_DOUBLE,
	VALUE_TYPE_STRING
} from '@enonic/js-utils/storage/indexing/index';
import {
	LibEvent,
	LibNode,
	LibValue,
	Log,
	Server
} from '@enonic/mock-xp';
import {
	describe,
	// expect,
	jest,
	test as it
} from '@jest/globals';
import {
	deepStrictEqual//,
	//throws
} from 'assert';

import {
	COLLECTION_REPO_PREFIX,
	FieldPath,
	NodeType,
	ROOT_PERMISSIONS_EXPLORER
} from '@enonic/explorer-utils';
import { create } from '../create';
import {
	COLLECTION_LANGUAGE,
	COLLECTION_NAME,
	COLLECTION_STEMMING_LANGUAGE,
	COLLECTIONS_FOLDER,
	COLLECTIONS_FOLDER_PATH,
	COLLECTOR_ID,
	COLLECTOR_VERSION,
	DOCUMENT_TYPES_FOLDER,
	DOCUMENT_TYPES_FOLDER_PATH
} from '../../../../../../../test/testData';


const server = new Server({
	loglevel: 'silent'
}).createRepo({
	id: 'com.enonic.app.explorer'
}).createRepo({
	id: `${COLLECTION_REPO_PREFIX}${COLLECTION_NAME}`
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

jest.mock('/lib/explorer/stemming/javaLocaleToSupportedLanguage', () => {
	return {
		javaLocaleToSupportedLanguage: jest.fn().mockImplementation((locale :string) => {
			if (locale === 'en-GB') {
				return 'en';
			}
			return 'en';
		})
	};
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

jest.mock('/lib/xp/value', () => LibValue, { virtual: true });

const connection = server.connect({
	branchId: 'master',
	repoId: 'com.enonic.app.explorer',
});
connection.create(COLLECTIONS_FOLDER);
connection.create(DOCUMENT_TYPES_FOLDER);


describe('document', () => {
	describe('create()', () => {
		describe('creates', () => {
			const myDocumentTypeNode2 = connection.create({
				_name: 'myDocumentTypeName2',
				_path: `${DOCUMENT_TYPES_FOLDER_PATH}/myDocumentTypeName2`,
				properties: [{
					enabled: true,
					fulltext: false,
					includeInAllText: false,
					max: 0,
					min: 0,
					name: 'zeroormorebooleans',
					nGram: false,
					path: false,
					valueType: VALUE_TYPE_BOOLEAN
				},{
					enabled: true,
					fulltext: false,
					includeInAllText: false,
					max: 1,
					min: 1,
					name: 'mustonlyonedouble',
					nGram: false,
					path: false,
					valueType: VALUE_TYPE_DOUBLE
				},{
					enabled: true,
					fulltext: true,
					includeInAllText: true,
					max: 0,
					min: 2,
					name: 'twoormorestrings',
					nGram: true,
					path: false,
					valueType: VALUE_TYPE_STRING
				}]
			});
			// log.info('myDocumentTypeNode2:%s', myDocumentTypeNode2);

			const myCollectionNode2 = connection.create({
				_name: 'myCollectionName2',
				_path: `${COLLECTIONS_FOLDER_PATH}/myCollectionName2`,
				documentTypeId: myDocumentTypeNode2._id,
				language: COLLECTION_LANGUAGE,
			});
			// log.info('myCollectionNode2:%s', myCollectionNode2);
			// log.info('myDocumentTypeNode2.properties:%s', myDocumentTypeNode2['properties']);

			server.createRepo({
				id: `${COLLECTION_REPO_PREFIX}myCollectionName2`
			});

			it('an "invalid" document node when requireValid=false and validate occurrences fails', () => {
				const createRes = create({
					collectionId: myCollectionNode2._id,
					collectorId: COLLECTOR_ID,
					collectorVersion: COLLECTOR_VERSION,
					data: {
						zeroOrMoreBooleans: true, // valid
						mustOnlyOneDouble: 0.1, // valis
						//twoOrMoreStrings: ['string1', 'string2'] // invalid occurences
						twoOrMoreStrings: 'string' // correct type, but too few
					},
					documentTypeId: myDocumentTypeNode2._id,
					requireValid: false, // default is false
					validateOccurrences: true, // default is false
					validateTypes: false // default is requireValid
				});
				// log.info('createRes:%s', createRes);

				deepStrictEqual(
					{
						_id: createRes._id,
						_indexConfig: createRes._indexConfig,
						_inheritsPermissions: false,
						_name: createRes._id,
						_nodeType: NodeType.DOCUMENT,
						_path: createRes._path,
						_permissions: ROOT_PERMISSIONS_EXPLORER,
						_state: 'DEFAULT',
						_ts: createRes._ts,
						_versionKey: createRes._versionKey,
						[FieldPath.META]: {
							collection: 'myCollectionName2',
							collector: {
								id: COLLECTOR_ID,
								version: COLLECTOR_VERSION
							},
							createdTime: createRes[FieldPath.META].createdTime,
							documentType: 'myDocumentTypeName2',
							language: COLLECTION_LANGUAGE,
							stemmingLanguage: COLLECTION_STEMMING_LANGUAGE,
							valid: false
						},
						mustonlyonedouble: 0.1,
						twoormorestrings: 'string',
						zeroormorebooleans: true
					},
					createRes
				); // deepStrictEqual
			}); // it
			it('an "invalid" document node when requireValid=false and validate types fails', () => {
				const createRes = create({
					collectionId: myCollectionNode2._id,
					collectorId: COLLECTOR_ID,
					collectorVersion: COLLECTOR_VERSION,
					data: {
						zeroOrMoreBooleans: 'notBoolean',
						mustOnlyOneDouble: 'notDouble',
						twoOrMoreStrings: [1, 2]
					},
					documentTypeId: myDocumentTypeNode2._id,
					requireValid: false, // default is false
					validateOccurrences: false, // default is false
					validateTypes: true // default is requireValid
				});
				// log.info('createRes:%s', createRes);

				deepStrictEqual(
					{
						_id: createRes._id,
						_indexConfig: createRes._indexConfig,
						_inheritsPermissions: false,
						_name: createRes._id,
						_nodeType: NodeType.DOCUMENT,
						_path: createRes._path,
						_permissions: ROOT_PERMISSIONS_EXPLORER,
						_state: 'DEFAULT',
						_ts: createRes._ts,
						_versionKey: createRes._versionKey,
						[FieldPath.META]: {
							collection: 'myCollectionName2',
							collector: {
								id: COLLECTOR_ID,
								version: COLLECTOR_VERSION
							},
							createdTime: createRes[FieldPath.META].createdTime,
							documentType: 'myDocumentTypeName2',
							language: COLLECTION_LANGUAGE,
							stemmingLanguage: COLLECTION_STEMMING_LANGUAGE,
							valid: false
						},
						mustonlyonedouble: 'notDouble',
						twoormorestrings: [1, 2],
						zeroormorebooleans: 'notBoolean'
					},
					createRes
				); // deepStrictEqual
			}); // it
		}); // describe creates
	}); // describe create
}); // describe document
