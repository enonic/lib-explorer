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
	deepStrictEqual,
	throws
} from 'assert';
import {
	describe,
	// expect,
	jest,
	test as it
} from '@jest/globals';
import {
	COLLECTION_REPO_PREFIX,
	FieldPath,
	NodeType,
	ROOT_PERMISSIONS_EXPLORER,
} from '@enonic/explorer-utils';
import { create } from './create';
import {
	COLLECTION,
	COLLECTION_LANGUAGE,
	COLLECTION_NAME,
	COLLECTION_STEMMING_LANGUAGE,
	COLLECTIONS_FOLDER,
	// COLLECTIONS_FOLDER_PATH,
	COLLECTOR_ID,
	COLLECTOR_VERSION,
	DOCUMENT_TYPE,
	DOCUMENT_TYPE_FIELDS,
	DOCUMENT_TYPE_NAME,
	DOCUMENT_TYPES_FOLDER,
	// DOCUMENT_TYPES_FOLDER_PATH,
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

//const repos = javaBridge.repo.list();
//javaBridge.log.info('repos:%s', repos);

const connection = server.connect({
	branchId: 'master',
	repoId: 'com.enonic.app.explorer',
});
connection.create(COLLECTIONS_FOLDER);

//──────────────────────────────────────────────────────────────────────────────
// Create a documentType to use in all tests
//──────────────────────────────────────────────────────────────────────────────
// javaBridge.log.info('DOCUMENT_TYPES_FOLDER:%s', DOCUMENT_TYPES_FOLDER);
connection.create(DOCUMENT_TYPES_FOLDER);

// javaBridge.log.info('DOCUMENT_TYPE:%s', DOCUMENT_TYPE);
const CREATED_DOCUMENT_TYPE_NODE = connection.create(DOCUMENT_TYPE);
// javaBridge.log.info('CREATED_DOCUMENT_TYPE_NODE:%s', CREATED_DOCUMENT_TYPE_NODE);

// const documentTypeNodePath = `${DOCUMENT_TYPES_FOLDER_PATH}/${DOCUMENT_TYPE_NAME}`;
// javaBridge.log.info('documentTypeNodePath:%s', documentTypeNodePath);

// const documentTypeNode = connection.get(documentTypeNodePath);
// javaBridge.log.info('documentTypeNode:%s', documentTypeNode);

//──────────────────────────────────────────────────────────────────────────────

const CREATED_COLLECTION_NODE = connection.create({
	...COLLECTION,
	documentTypeId: CREATED_DOCUMENT_TYPE_NODE._id,
});
// const queryRes = connection.query({});
// const nodes = queryRes.hits.map(({id}) => connection.get(id));
// log.info('nodes:%s', nodes);


describe('document', () => {
	describe('create()', () => {
		describe('throws', () => {
			it(`on missing parameter object`, () => {
				throws(
					() => create(undefined),
					{
						message: 'create: parameter object is missing!',
						name: 'Error'
					}
				);
			}); // it

			it(`if at least one of (validateTypes), validateOccurrences or cleanExtraFields is true and none of documentTypeName, documentTypeId or fields is provided`, () => {
				throws(
					// @ts-expect-error TS2345
					() => create({
						addExtraFields: false, // To avoid previous error
						validateTypes: true
					}),
					{
						message: "create: when at least one of validateTypes, validateOccurrences or cleanExtraFields is true, either documentTypeName, documentTypeId or fields must be provided or (collectionName or collectionId and the collectionNode must contain a default documentTypeId)!",
						name: 'Error'
					}
				);
			}); // it
			it(`if at least one of validateTypes, (validateOccurrences) or cleanExtraFields is true and none of documentTypeName, documentTypeId or fields is provided`, () => {
				throws(
					// @ts-expect-error TS2345
					() => create({
						addExtraFields: false, // To avoid previous error
						validateOccurrences: true
					}),
					{
						message: "create: when at least one of validateTypes, validateOccurrences or cleanExtraFields is true, either documentTypeName, documentTypeId or fields must be provided or (collectionName or collectionId and the collectionNode must contain a default documentTypeId)!",
						name: 'Error'
					}
				);
			}); // it
			it(`if at least one of validateTypes, validateOccurrences or (cleanExtraFields) is true and none of documentTypeName, documentTypeId or fields is provided`, () => {
				throws(
					// @ts-expect-error TS2345
					() => create({
						addExtraFields: false, // To avoid previous error
						cleanExtraFields: true
					}),
					{
						message: "create: when at least one of validateTypes, validateOccurrences or cleanExtraFields is true, either documentTypeName, documentTypeId or fields must be provided or (collectionName or collectionId and the collectionNode must contain a default documentTypeId)!",
						name: 'Error'
					}
				);
			}); // it

			it(`if requireValid=true and both validateTypes and validateOccurrences are false`, () => {
				throws(
					// @ts-expect-error TS2345
					() => create({
						documentTypeName: DOCUMENT_TYPE_NAME,
						requireValid: true,
						validateTypes: false,
						validateOccurrences: false
					}),
					{
						message: "create: when requireValid=true either validateTypes or validateOccurrences must be true!",
						name: 'Error'
					}
				);
			}); // it

			it(`if both collectionName and collectionId are missing`, () => {
				throws(
					// @ts-expect-error TS2345
					() => create({
						documentTypeName: DOCUMENT_TYPE_NAME
					}),
					{
						message: "create: either provide collectionName or collectionId!",
						name: 'Error'
					}
				);
			}); // it

			it(`when collectionId is not an uuidv4 string`, () => {
				throws(
					() => create({
						collectionId: '',
						collectorId: COLLECTOR_ID,
						collectorVersion: COLLECTOR_VERSION,
						documentTypeName: DOCUMENT_TYPE_NAME
					}),
					{
						message: "create: parameter 'collectionId' is not an uuidv4 string!",
						name: 'TypeError'
					}
				);
			}); // it

			it(`on missing collectorId`, () => {
				throws(
					// @ts-expect-error TS2345
					() => create({
						collectionId: CREATED_COLLECTION_NODE._id,
						documentTypeName: DOCUMENT_TYPE_NAME
					}),
					{
						message: "create: required parameter 'collectorId' is missing!",
						name: 'Error'
					}
				);
			}); // it
			it(`when collectorId is not a string`, () => {
				throws(
					() => create({
						collectionId: CREATED_COLLECTION_NODE._id,
						// @ts-expect-error TS2322: Type 'number' is not assignable to type 'string'.
						collectorId: 0,
						collectorVersion: COLLECTOR_VERSION,
						documentTypeName: DOCUMENT_TYPE_NAME
					}),
					{
						message: "create: parameter 'collectorId' is not a string!",
						name: 'TypeError'
					}
				);
			}); // it
			it(`on missing collectorVersion`, () => {
				throws(
					// @ts-expect-error TS2345
					() => create({
						collectionId: CREATED_COLLECTION_NODE._id,
						collectorId: COLLECTOR_ID,
						documentTypeName: DOCUMENT_TYPE_NAME
					}),
					{
						message: "create: required parameter 'collectorVersion' is missing!",
						name: 'Error'
					}
				);
			}); // it
			it(`when collectorVersion is not a string`, () => {
				throws(
					() => create({
						collectionId: CREATED_COLLECTION_NODE._id,
						collectorId: COLLECTOR_ID,
						// @ts-expect-error TS2322: Type 'number' is not assignable to type 'string'.
						collectorVersion: 0,
						documentTypeName: DOCUMENT_TYPE_NAME
					}),
					{
						message: "create: parameter 'collectorVersion' is not a string!",
						name: 'TypeError'
					}
				);
			}); // it


			it(`when the document already exists (_name)`, () => {
				const createParam = {
					collectionId: CREATED_COLLECTION_NODE._id,
					collectorId: COLLECTOR_ID,
					collectorVersion: COLLECTOR_VERSION,
					documentTypeName: DOCUMENT_TYPE_NAME,
					data: {
						//_id:
						_name: 'a'
						//_parentPath: '/'
						//_path:
					}
				};
				//const createdDocument =
				create(createParam);
				//javaBridge.log.info('createdDocument:%s', createdDocument);
				throws(
					() => create(createParam),
					{
						message: "Node already exists at /a repository: com.enonic.app.explorer.collection.myCollectionName branch: master",
						name: 'com.enonic.xp.node.NodeAlreadyExistAtPathException'
					}
				);
				//const queryRes = connection.query({});
				//const nodes = queryRes.hits.map(({id}) => connection.get(id));
				//javaBridge.log.info('nodes:%s', nodes);
			}); // it
		}); // describe throws

		describe('creates', () => {
			it(`is able to get collectionName, language and stemmmingLanguage from collectionId`, () => {
				const _indexConfig = JSON.parse(JSON.stringify(INDEX_CONFIG));
				_indexConfig.configs.push({
					path: 'extra',
					config: {
						decideByType: false,
						enabled: true,
						fulltext: false,
						includeInAllText: false,
						// languages: [COLLECTION_STEMMING_LANGUAGE], // Only when stemmed is true and language is passed
						nGram: false,
						path: false
					}
				});
				_indexConfig.configs.push({
					path: 'mystring',
					config: {
						decideByType: false,
						enabled: true,
						fulltext: true,
						includeInAllText: true,
						// languages: [COLLECTION_STEMMING_LANGUAGE], // Only when stemmed is true and language is passed
						nGram: true,
						path: false
					}
				});
				//javaBridge.log.info('_indexConfig:%s', _indexConfig);
				const createRes = create({
					// Input
					collectionId: CREATED_COLLECTION_NODE._id,
					collectorId: COLLECTOR_ID,
					collectorVersion: COLLECTOR_VERSION,
					data: {
						myString: 'string',
						extra: 'extra'
					},
					documentTypeName: DOCUMENT_TYPE_NAME,
					// Options
					//addExtraFields, // default is !cleanExtraFields
					//cleanExtraFields: false, // default is false
					//cleanExtraFields: true,
					requireValid: true,
					validateOccurrences: true//, // default is false
					//validateTypes: true // default is same as requireValid
				});
				const expected = {
					_id: createRes._id,
					_indexConfig,
					_inheritsPermissions: false,
					_name: createRes._id,
					_nodeType: NodeType.DOCUMENT,
					_path: createRes._path,
					_permissions: ROOT_PERMISSIONS_EXPLORER,
					_state: 'DEFAULT',
					_ts: createRes._ts,
					_versionKey: createRes._versionKey,
					[FieldPath.META]: {
						collection: COLLECTION_NAME,
						collector: {
							id: COLLECTOR_ID,
							version: COLLECTOR_VERSION
						},
						createdTime: createRes[FieldPath.META].createdTime,
						documentType: DOCUMENT_TYPE_NAME,
						language: COLLECTION_LANGUAGE,
						stemmingLanguage: COLLECTION_STEMMING_LANGUAGE,
						valid: true
					},
					extra: 'extra',
					mystring: 'string'
				};
				// javaBridge.log.info('expected:%s', expected);
				// javaBridge.log.info('createRes:%s', createRes);
				deepStrictEqual(
					createRes,
					expected
				) // deepStrictEqual
			}); // it

			it("is able to do it's thing without connecting to the explorer repo WHEN enough info is provided in the parameters", () => {
				const _indexConfig = JSON.parse(JSON.stringify(INDEX_CONFIG));
				_indexConfig.configs.push({
					path: 'mystring',
					config: {
						decideByType: false,
						enabled: true,
						fulltext: true,
						includeInAllText: true,
						// languages: [COLLECTION_STEMMING_LANGUAGE], // Only when stemmed is true and language is passed
						nGram: true,
						path: false
					}
				});
				const createRes = create({
					collectionName: COLLECTION_NAME,
					collectorId: COLLECTOR_ID,
					collectorVersion: COLLECTOR_VERSION,
					data: {
						[FieldPath.META]: {
							shouldBeStripped: 'shouldBeStripped'
						},
						global: {
							shouldBeStripped: 'shouldBeStripped'
						},
						myString: 'string',
						extra: 'extra'
					},
					documentTypeName: DOCUMENT_TYPE_NAME,
					fields: DOCUMENT_TYPE_FIELDS,
					language: COLLECTION_LANGUAGE,
					// Options
					cleanExtraFields: true, // default is false
				}); // create
				deepStrictEqual(
					{
						_id: createRes._id,
						_indexConfig,
						_inheritsPermissions: false,
						_name: createRes._id,
						_nodeType: NodeType.DOCUMENT,
						_path: createRes._path,
						_permissions: ROOT_PERMISSIONS_EXPLORER,
						_state: 'DEFAULT',
						_ts: createRes._ts,
						_versionKey: createRes._versionKey,
						[FieldPath.META]: {
							collection: COLLECTION_NAME,
							collector: {
								id: COLLECTOR_ID,
								version: COLLECTOR_VERSION
							},
							createdTime: createRes[FieldPath.META].createdTime,
							documentType: DOCUMENT_TYPE_NAME,
							language: COLLECTION_LANGUAGE,
							stemmingLanguage: COLLECTION_STEMMING_LANGUAGE,
							valid: true
						},
						mystring: 'string'
					},
					createRes
				) // deepStrictEqual
			}); // it
		}); // describe creates
	}); // describe create
}); // describe document
