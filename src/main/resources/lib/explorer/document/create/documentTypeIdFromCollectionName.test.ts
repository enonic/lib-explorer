import type { send } from '@enonic-types/lib-event';
import type { connect } from '@enonic-types/lib-node';


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
import {deepStrictEqual} from 'assert';
import {
	COLLECTION_REPO_PREFIX,
	ROOT_PERMISSIONS_EXPLORER,
	FieldPath,
	NodeType
} from '@enonic/explorer-utils';
import { create } from '../create';
import {
	COLLECTION,
	COLLECTION_LANGUAGE,
	COLLECTION_NAME,
	COLLECTION_STEMMING_LANGUAGE,
	COLLECTIONS_FOLDER,
	COLLECTOR_ID,
	COLLECTOR_VERSION,
	DOCUMENT_TYPE,
	DOCUMENT_TYPE_NAME,
	DOCUMENT_TYPES_FOLDER,
	INDEX_CONFIG
} from '../../../../../../../test/testData';


const server = new Server({
	loglevel: 'silent'
})
.createRepo({id: 'com.enonic.app.explorer'})
.createRepo({id: `${COLLECTION_REPO_PREFIX}${COLLECTION_NAME}`});

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

//──────────────────────────────────────────────────────────────────────────────
// Create a documentType to use in all tests
//──────────────────────────────────────────────────────────────────────────────
// log.info('DOCUMENT_TYPES_FOLDER:%s', DOCUMENT_TYPES_FOLDER);
connection.create(DOCUMENT_TYPES_FOLDER);

// log.info('DOCUMENT_TYPE:%s', DOCUMENT_TYPE);
const CREATED_DOCUMENT_TYPE_NODE = connection.create(DOCUMENT_TYPE);
// log.info('CREATED_DOCUMENT_TYPE_NODE:%s', CREATED_DOCUMENT_TYPE_NODE);

// const documentTypeNodePath = `${DOCUMENT_TYPES_FOLDER_PATH}/${DOCUMENT_TYPE_NAME}`;
// log.info('documentTypeNodePath:%s', documentTypeNodePath);

// const documentTypeNode = connection.get(documentTypeNodePath);
// log.info('documentTypeNode:%s', documentTypeNode);

//──────────────────────────────────────────────────────────────────────────────

const CREATED_COLLECTION_NODE = connection.create({
	...COLLECTION,
	documentTypeId: CREATED_DOCUMENT_TYPE_NODE._id,
});
// log.info('CREATED_COLLECTION_NODE:%s', CREATED_COLLECTION_NODE);

// const queryRes = connection.query({});
// const nodes = queryRes.hits.map(({id}) => connection.get(id));
// log.info('nodes:%s', nodes);


describe('document', () => {
	describe('create()', () => {
		describe('creates', () => {
			it(`is able to get default documentType from collectionName`, () => {
				const createdDocumentNode = create({
					// Input
					// collectionId: CREATED_COLLECTION_NODE._id,
					collectionName: COLLECTION_NAME,
					collectorId: COLLECTOR_ID,
					collectorVersion: COLLECTOR_VERSION,
					data: {
						myString: 'string'
					},
					// documentTypeName: DOCUMENT_TYPE_NAME,
					// Options
					//addExtraFields, // default is !cleanExtraFields
					//cleanExtraFields: false, // default is false
					//cleanExtraFields: true,
					requireValid: true,
					validateOccurrences: true//, // default is false
					//validateTypes: true // default is same as requireValid
				});
				// log.info('createdDocumentNode:%s', createdDocumentNode);
				const _indexConfig = JSON.parse(JSON.stringify(INDEX_CONFIG));
				_indexConfig.configs.push({
					path: 'mystring',
					config: {
						decideByType: false,
						enabled: true,
						fulltext: true,
						includeInAllText: true,
						// languages: [COLLECTION_STEMMING_LANGUAGE], // Only when stemmed = true and language passed.
						nGram: true,
						path: false
					}
				});
				const expected = {
					_id: createdDocumentNode._id,
					_indexConfig,
					_inheritsPermissions: false,
					_name: createdDocumentNode._id,
					_nodeType: NodeType.DOCUMENT,
					_path: createdDocumentNode._path,
					_permissions: ROOT_PERMISSIONS_EXPLORER,
					_state: 'DEFAULT',
					_ts: createdDocumentNode._ts,
					_versionKey: createdDocumentNode._versionKey,
					[FieldPath.META]: {
						collection: COLLECTION_NAME,
						collector: {
							id: COLLECTOR_ID,
							version: COLLECTOR_VERSION
						},
						createdTime: createdDocumentNode[FieldPath.META].createdTime,
						documentType: DOCUMENT_TYPE_NAME,
						language: COLLECTION_LANGUAGE,
						stemmingLanguage: COLLECTION_STEMMING_LANGUAGE,
						valid: true
					},
					mystring: 'string'
				};
				deepStrictEqual(
					createdDocumentNode,
					expected
				);
			}); // it

			it(`is able to get default documentType from collectionId`, () => {
				const createdDocumentNode = create({
					// Input
					collectionId: CREATED_COLLECTION_NODE._id,
					// collectionName: COLLECTION_NAME,
					collectorId: COLLECTOR_ID,
					collectorVersion: COLLECTOR_VERSION,
					data: {
						myString: 'string'
					},
					// documentTypeName: DOCUMENT_TYPE_NAME,
					// Options
					//addExtraFields, // default is !cleanExtraFields
					//cleanExtraFields: false, // default is false
					//cleanExtraFields: true,
					requireValid: true,
					validateOccurrences: true//, // default is false
					//validateTypes: true // default is same as requireValid
				});
				// log.info('createdDocumentNode:%s', createdDocumentNode);
				const _indexConfig = JSON.parse(JSON.stringify(INDEX_CONFIG));
				_indexConfig.configs.push({
					path: 'mystring',
					config: {
						decideByType: false,
						enabled: true,
						fulltext: true,
						includeInAllText: true,
						// languages: [COLLECTION_STEMMING_LANGUAGE], // Only when stemmed = true and language passed.
						nGram: true,
						path: false
					}
				});
				const expected = {
					_id: createdDocumentNode._id,
					_indexConfig,
					_inheritsPermissions: false,
					_name: createdDocumentNode._id,
					_nodeType: NodeType.DOCUMENT,
					_path: createdDocumentNode._path,
					_permissions: ROOT_PERMISSIONS_EXPLORER,
					_state: 'DEFAULT',
					_ts: createdDocumentNode._ts,
					_versionKey: createdDocumentNode._versionKey,
					[FieldPath.META]: {
						collection: COLLECTION_NAME,
						collector: {
							id: COLLECTOR_ID,
							version: COLLECTOR_VERSION
						},
						createdTime: createdDocumentNode[FieldPath.META].createdTime,
						documentType: DOCUMENT_TYPE_NAME,
						language: COLLECTION_LANGUAGE,
						stemmingLanguage: COLLECTION_STEMMING_LANGUAGE,
						valid: true
					},
					mystring: 'string'
				};
				deepStrictEqual(
					createdDocumentNode,
					expected
				);
			}); // it

		}); // describe creates
	}); // describe create
}); // describe document
