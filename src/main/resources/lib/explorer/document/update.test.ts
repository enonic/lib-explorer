import type { send } from '@enonic-types/lib-event';
import type { connect } from '@enonic-types/lib-node';


import { sortByProperty } from '@enonic/js-utils/array';
import {
	LibEvent,
	LibNode,
	LibValue,
	Log,
	Server
} from '@enonic/mock-xp';
import {
	deepStrictEqual,
	throws
} from 'assert';
import {
	describe,
	expect,
	jest,
	test as it
} from '@jest/globals';
import {
	COLLECTION_REPO_PREFIX,
	FieldPath,
	NodeType,
	ROOT_PERMISSIONS_EXPLORER
} from '@enonic/explorer-utils';
import { create } from './create';
import { update } from './update';
import {
	COLLECTION,
	//COLLECTION_LANGUAGE,
	COLLECTION_NAME,
	COLLECTION_STEMMING_LANGUAGE,
	COLLECTIONS_FOLDER,
	COLLECTOR_ID,
	COLLECTOR_VERSION,
	DOCUMENT_TYPE,
	DOCUMENT_TYPE_FIELDS,
	DOCUMENT_TYPE_NAME,
	DOCUMENT_TYPES_FOLDER,
	INDEX_CONFIG
} from '../../../../../../test/testData';


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
const CREATED_DOCUMENT_TYPE_NODE = connection.create(DOCUMENT_TYPE);
const CREATED_COLLECTION_NODE = connection.create({
	...COLLECTION,
	documentTypeId: CREATED_DOCUMENT_TYPE_NODE._id,
});
const _indexConfig = JSON.parse(JSON.stringify(INDEX_CONFIG));
_indexConfig.configs.push({
	path: 'myString',
	config: {
		decideByType: false,
		enabled: true,
		fulltext: true,
		includeInAllText: true,
		// languages: [COLLECTION_STEMMING_LANGUAGE], // Only when stemmed is true and language is passed.
		nGram: true,
		path: false
	}
});

const CREATED_DOCUMENT_NODE = create({
	collectionId: CREATED_COLLECTION_NODE._id,
	collectorId: COLLECTOR_ID,
	collectorVersion: COLLECTOR_VERSION,
	data: {
		myString: 'string'
	},
	documentTypeId: CREATED_DOCUMENT_TYPE_NODE._id,
	requireValid: true, // default is false
	//validateOccurrences: true, // default is false
	//validateTypes: true // default is requireValid
});
// log.info('CREATED_DOCUMENT_NODE:%s', CREATED_DOCUMENT_NODE);

// const CREATED_INVALID_DOCUMENT_NODE = create({
// 	collectionId: CREATED_COLLECTION_NODE._id,
// 	collectorId: COLLECTOR_ID,
// 	collectorVersion: COLLECTOR_VERSION,
// 	data: {
// 		myString: 0
// 	},
// 	documentTypeId: CREATED_DOCUMENT_TYPE_NODE._id,
// 	requireValid: false, // default is false
// 	//validateOccurrences: true, // default is false
// 	validateTypes: true // default is requireValid
// });
// log.info('CREATED_INVALID_DOCUMENT_NODE:%s', CREATED_INVALID_DOCUMENT_NODE);

// const queryRes = connection.query({});
// const nodes = queryRes.hits.map(({id}) => connection.get(id));
// log.info('nodes:%s', nodes);

describe('document', () => {
	describe('update()', () => {

		it('leaves document node unchanged when diff is empty', () => {
			const updateRes = update({
				collectionId: CREATED_COLLECTION_NODE._id,
				collectorId: COLLECTOR_ID,
				collectorVersion: COLLECTOR_VERSION,
				data: {
					_id: CREATED_DOCUMENT_NODE._id,
					myString: 'string'
				},
				partial: true
			});
			expect(updateRes).toStrictEqual(CREATED_DOCUMENT_NODE);
		}); // it

		describe('throws', () => {
			it(`on missing parameter object`, () => {
				throws(
					() => update(undefined),
					{
						message: 'update: parameter object is missing!',
						name: 'Error'
					}
				);
			}); // it
			it(`if data is null`, () => {
				throws(
					() => update({
						collectionId: CREATED_COLLECTION_NODE._id,
						collectorId: COLLECTOR_ID,
						collectorVersion: COLLECTOR_VERSION,
						data: null
						//data: undefined // defauls to {}
					}),
					{
						message: "update: missing required parameter data!",
						name: 'Error'
					}
				);
			}); // it
			it(`if data is not an Object`, () => {
				throws(
					() => update({
						collectionId: CREATED_COLLECTION_NODE._id,
						collectorId: COLLECTOR_ID,
						collectorVersion: COLLECTOR_VERSION,
						// @ts-expect-error 2322
						data: 'string'
					}),
					{
						message: "update: parameter 'data' is not an Object!",
						name: 'TypeError'
					}
				);
			}); // it
			it(`if data doesn't contain _id`, () => {
				throws(
					() => update({
						collectionName: COLLECTION_NAME,
						collectorId: COLLECTOR_ID,
						collectorVersion: COLLECTOR_VERSION,
						documentTypeName: DOCUMENT_TYPE_NAME,
						data: {},
						fields: DOCUMENT_TYPE_FIELDS//,
						//language: COLLECTION_LANGUAGE
					}),
					{
						message: "update: parameter data: missing required property '_id'!",
						name: 'Error'
					}
				);
			}); // it
			it(`if data._id not uuidv4 string`, () => {
				throws(
					() => update({
						collectionName: COLLECTION_NAME,
						collectorId: COLLECTOR_ID,
						collectorVersion: COLLECTOR_VERSION,
						documentTypeName: DOCUMENT_TYPE_NAME,
						data: {
							_id: ''
						},
						fields: DOCUMENT_TYPE_FIELDS//,
						//language: COLLECTION_LANGUAGE
					}),
					{
						message: "update: parameter data: property '_id' is not an uuidv4 string!",
						name: 'TypeError'
					}
				);
			}); // it
			it(`if both collectionName and collectionId are missing`, () => {
				throws(
					() => update({
						// @ts-expect-error 2322
						data: CREATED_DOCUMENT_NODE
					}),
					{
						message: "update: either provide collectionName or collectionId!",
						name: 'Error'
					}
				);
			}); // it
			it(`if both documentTypeName, documentTypeId and collectionId are missing`, () => {
				throws(
					() => update({
						collectionName: COLLECTION_NAME,
						// @ts-expect-error 2322
						data: CREATED_DOCUMENT_NODE
					}),
					{
						message: "update: either provide documentTypeName, documentTypeId or collectionId!",
						name: 'Error'
					}
				);
			}); // it
			it(`if both fields, documentTypeId and collectionId are missing`, () => {
				throws(
					() => update({
						collectionName: COLLECTION_NAME,
						documentTypeName: DOCUMENT_TYPE_NAME,
						// @ts-expect-error 2322
						data: CREATED_DOCUMENT_NODE
					}),
					{
						message: "update: either provide fields, documentTypeId or collectionId!",
						name: 'Error'
					}
				);
			}); // it
			it(`on missing collectorId`, () => {
				throws(
					() => update({
						collectionId: CREATED_COLLECTION_NODE._id,
						// @ts-expect-error 2322
						data: CREATED_DOCUMENT_NODE
					}),
					{
						message: "update: required parameter 'collectorId' is missing!",
						name: 'Error'
					}
				);
			}); // it
			it(`when collectorId is not a string`, () => {
				throws(
					() => update({
						collectionId: CREATED_COLLECTION_NODE._id,
						// @ts-expect-error 2322 Type 'number' is not assignable to type 'string'
						collectorId: 0,
						collectorVersion: COLLECTOR_VERSION,
						// @ts-expect-error 2322
						data: CREATED_DOCUMENT_NODE
					}),
					{
						message: "update: parameter 'collectorId' is not a string!",
						name: 'TypeError'
					}
				);
			}); // it
			it(`throws on missing collectorVersion`, () => {
				throws(
					() => update({
						collectionId: CREATED_COLLECTION_NODE._id,
						collectorId: COLLECTOR_ID,
						// @ts-expect-error 2322
						data: CREATED_DOCUMENT_NODE
					}),
					{
						message: "update: required parameter 'collectorVersion' is missing!",
						name: 'Error'
					}
				);
			}); // it
			it(`when collectorVersion is not a string`, () => {
				throws(
					() => update({
						collectionId: CREATED_COLLECTION_NODE._id,
						collectorId: COLLECTOR_ID,
						// @ts-expect-error 2322 Type 'number' is not assignable to type 'string'
						collectorVersion: 0,
						// @ts-expect-error 2322
						data: CREATED_DOCUMENT_NODE
					}),
					{
						message: "update: parameter 'collectorVersion' is not a string!",
						name: 'TypeError'
					}
				);
			}); // it
			it(`when collectionId is not an uuidv4 string`, () => {
				throws(
					() => update({
						collectionId: '',
						collectorId: COLLECTOR_ID,
						collectorVersion: COLLECTOR_VERSION,
						// @ts-expect-error 2322
						data: CREATED_DOCUMENT_NODE
					}),
					{
						message: "update: parameter 'collectionId' is not an uuidv4 string!",
						name: 'TypeError'
					}
				);
			}); // it
			it(`when collectionName is not a string`, () => {
				throws(
					() => update({
						// @ts-expect-error 2322 Type 'boolean' is not assignable to type 'string'
						collectionName: true, // !string
						collectorId: COLLECTOR_ID,
						collectorVersion: COLLECTOR_VERSION,
						// @ts-expect-error 2322
						data: CREATED_DOCUMENT_NODE,
						documentTypeName: DOCUMENT_TYPE_NAME,
						fields: DOCUMENT_TYPE_FIELDS
					}),
					{
						message: "update: parameter 'collectionName' is not a string!",
						name: 'TypeError'
					}
				);
			}); // it
			it(`when documentTypeName is not a string`, () => {
				throws(
					() => update({
						collectionName: COLLECTION_NAME,
						collectorId: COLLECTOR_ID,
						collectorVersion: COLLECTOR_VERSION,
						// @ts-expect-error 2322
						data: CREATED_DOCUMENT_NODE,
						// @ts-expect-error 2322 Type 'boolean' is not assignable to type 'string'
						documentTypeName: true, // !string
						fields: DOCUMENT_TYPE_FIELDS
					}),
					{
						message: "update: parameter 'documentTypeName' is not a string!",
						name: 'TypeError'
					}
				);
			}); // it
			it(`when documentTypeId is not a string`, () => {
				throws(
					() => update({
						collectionName: COLLECTION_NAME,
						collectorId: COLLECTOR_ID,
						collectorVersion: COLLECTOR_VERSION,
						// @ts-expect-error 2322
						data: CREATED_DOCUMENT_NODE,
						// @ts-expect-error 2322 Type 'boolean' is not assignable to type 'string'
						documentTypeId: true, // !string
						fields: DOCUMENT_TYPE_FIELDS
					}),
					{
						message: "update: parameter 'documentTypeId' is not a string!",
						name: 'TypeError'
					}
				);
			}); // it
			it(`when requireValid=true and invalid`, () => {
				// log.info('CREATED_COLLECTION_NODE:%s', CREATED_COLLECTION_NODE);
				// log.info('CREATED_DOCUMENT_TYPE_NODE:%s', CREATED_DOCUMENT_TYPE_NODE);
				// log.info("CREATED_DOCUMENT_TYPE_NODE['properties']:%s", CREATED_DOCUMENT_TYPE_NODE['properties']);
				throws(
					() => update({
						collectionId: CREATED_COLLECTION_NODE._id,
						collectorId: COLLECTOR_ID,
						collectorVersion: COLLECTOR_VERSION,
						data: {
							_id: CREATED_DOCUMENT_NODE._id,
							myString: 0 // Should be string, thus fails validation as we want
						},
						requireValid: true
					}),
					{
						message: /validation failed/,
						name: 'Error'
					}
				);
			}); // it
		}); // describe throws

		describe('modifies document node', () => {
			it(`modifies data, but not under ${FieldPath.META} nor ${FieldPath.GLOBAL}`, () => {
				// log.info('CREATED_DOCUMENT_NODE:%s', CREATED_DOCUMENT_NODE);
				const updateRes = update({
					collectionId: CREATED_COLLECTION_NODE._id,
					collectorId: COLLECTOR_ID,
					collectorVersion: COLLECTOR_VERSION,
					data: {
						_id: CREATED_DOCUMENT_NODE._id,
						[FieldPath.GLOBAL]: {
							illegal: 'shouldBeCleaned'
						},
						[FieldPath.META]: {
							createdTime: 'createdTime',
							illegal: 'shouldBeCleaned'
						},
						myString: 'myStringChanged'
					}
				});
				deepStrictEqual(
					{
						_id: CREATED_DOCUMENT_NODE._id,
						_indexConfig: CREATED_DOCUMENT_NODE._indexConfig,
						_inheritsPermissions: false,
						_name: CREATED_DOCUMENT_NODE._id,
						_nodeType: NodeType.DOCUMENT,
						_path: updateRes._path,
						_permissions: ROOT_PERMISSIONS_EXPLORER,
						_state: 'DEFAULT',
						_ts: updateRes._ts,
						_versionKey: updateRes._versionKey,
						[FieldPath.META]: {
							collection: 'myCollectionName',
							collector: {
								id: COLLECTOR_ID,
								version: COLLECTOR_VERSION
							},
							createdTime: CREATED_DOCUMENT_NODE[FieldPath.META].createdTime,
							documentType: 'myDocumentTypeName',
							language: 'en-GB',
							modifiedTime: updateRes[FieldPath.META].modifiedTime,
							stemmingLanguage: 'en',
							valid: true
						},
						mystring: 'myStringChanged'
					},
					updateRes
				) // deepStrictEqual
			}); // it
			it(`adds indexconfig for new fields`, () => {
				// log.info('CREATED_DOCUMENT_NODE:%s', CREATED_DOCUMENT_NODE);
				// log.info('CREATED_DOCUMENT_NODE._indexConfig.configs:%s', CREATED_DOCUMENT_NODE._indexConfig.configs);
				const updateRes = update({
					collectionId: CREATED_COLLECTION_NODE._id,
					collectorId: COLLECTOR_ID,
					collectorVersion: COLLECTOR_VERSION,
					data: {
						_id: CREATED_DOCUMENT_NODE._id,
						[FieldPath.META]: {
							createdTime: 'createdTime'
						},
						myString: 'myStringChanged',
						extra: 'extraAdded'
					}
				});
				const _indexConfig = JSON.parse(JSON.stringify(CREATED_DOCUMENT_NODE._indexConfig));
				_indexConfig.configs.push({
					path: 'extra',
					config: {
						decideByType: false,
						enabled: true,
						fulltext: false,
						includeInAllText: false,
						// languages: [COLLECTION_STEMMING_LANGUAGE], // Only when stemmed is true and language is passed.
						nGram: false,
						path: false
					}
				});
				_indexConfig.configs = sortByProperty(_indexConfig.configs, 'path');
				deepStrictEqual(
					{
						_id: CREATED_DOCUMENT_NODE._id,
						_indexConfig,
						_inheritsPermissions: false,
						_name: CREATED_DOCUMENT_NODE._id,
						_nodeType: NodeType.DOCUMENT,
						_path: updateRes._path,
						_permissions: ROOT_PERMISSIONS_EXPLORER,
						_state: 'DEFAULT',
						_ts: updateRes._ts,
						_versionKey: updateRes._versionKey,
						[FieldPath.META]: {
							collection: 'myCollectionName',
							collector: {
								id: COLLECTOR_ID,
								version: COLLECTOR_VERSION
							},
							createdTime: CREATED_DOCUMENT_NODE[FieldPath.META].createdTime,
							documentType: 'myDocumentTypeName',
							language: 'en-GB',
							modifiedTime: updateRes[FieldPath.META].modifiedTime,
							stemmingLanguage: 'en',
							valid: true
						},
						extra: 'extraAdded',
						mystring: 'myStringChanged'
					},
					updateRes
				) // deepStrictEqual
			}); // it
		}); // describe modifies document node

	}); // describe update()
}); // describe document
