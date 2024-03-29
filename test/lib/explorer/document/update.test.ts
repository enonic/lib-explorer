import type { JavaBridge as JavaBridgeWithStemmingLanguageFromLocale } from '../../../../src/main/resources/lib/explorer/_coupling/types';

//import type {LooseObject} from '../../../types.d';


import { sortByProperty } from '@enonic/js-utils/array/sortBy';
import { JavaBridge } from '@enonic/mock-xp';
import Log from '@enonic/mock-xp/src/Log';
import {
	deepStrictEqual,
	throws
} from 'assert';
import {
	describe,
	expect,
	test as it
} from '@jest/globals';
import {
	COLLECTION_REPO_PREFIX,
	FieldPath,
	NodeType,
	ROOT_PERMISSIONS_EXPLORER
} from '@enonic/explorer-utils';
import { create } from '../../../../src/main/resources/lib/explorer/_uncoupled/document/create';
import { update } from '../../../../src/main/resources/lib/explorer/_uncoupled/document/update';
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
} from '../../../testData';

const log = Log.createLogger({
	loglevel: 'silent'
});


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
javaBridge.repo.create({
	id: `${COLLECTION_REPO_PREFIX}${COLLECTION_NAME}`
});
//const repos = javaBridge.repo.list();
//javaBridge.log.info('repos:%s', repos);

const connection = javaBridge.connect({
	repoId: 'com.enonic.app.explorer',
	branch: 'master'
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

//@ts-ignore
javaBridge.stemmingLanguageFromLocale = (locale :string) => {
	if (locale === 'en-GB') {
		return 'en';
	}
	return 'en';
}

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
}, javaBridge as unknown as JavaBridgeWithStemmingLanguageFromLocale);
//javaBridge.log.info('CREATED_DOCUMENT_NODE:%s', CREATED_DOCUMENT_NODE);

/*const CREATED_INVALID_DOCUMENT_NODE = create({
	collectionId: CREATED_COLLECTION_NODE._id,
	collectorId: COLLECTOR_ID,
	collectorVersion: COLLECTOR_VERSION,
	data: {
		myString: 0
	},
	documentTypeId: CREATED_DOCUMENT_TYPE_NODE._id,
	requireValid: false, // default is false
	//validateOccurrences: true, // default is false
	validateTypes: true // default is requireValid
}, javaBridge as unknown as JavaBridgeWithStemmingLanguageFromLocale);*/
//javaBridge.log.info('CREATED_INVALID_DOCUMENT_NODE:%s', CREATED_INVALID_DOCUMENT_NODE);

/*const queryRes = connection.query({});
const nodes = queryRes.hits.map(({id}) => connection.get(id));
javaBridge.log.info('nodes:%s', nodes);*/

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
			}, javaBridge as unknown as JavaBridgeWithStemmingLanguageFromLocale);
			expect(updateRes).toStrictEqual(CREATED_DOCUMENT_NODE);
		}); // it

		describe('throws', () => {
			it(`on missing parameter object`, () => {
				throws(
					() => update(undefined, javaBridge as unknown as JavaBridgeWithStemmingLanguageFromLocale),
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
					}, javaBridge as unknown as JavaBridgeWithStemmingLanguageFromLocale),
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
					}, javaBridge as unknown as JavaBridgeWithStemmingLanguageFromLocale),
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
					}, javaBridge as unknown as JavaBridgeWithStemmingLanguageFromLocale),
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
					}, javaBridge as unknown as JavaBridgeWithStemmingLanguageFromLocale),
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
					}, javaBridge as unknown as JavaBridgeWithStemmingLanguageFromLocale),
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
					}, javaBridge as unknown as JavaBridgeWithStemmingLanguageFromLocale),
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
					}, javaBridge as unknown as JavaBridgeWithStemmingLanguageFromLocale),
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
					}, javaBridge as unknown as JavaBridgeWithStemmingLanguageFromLocale),
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
					}, javaBridge as unknown as JavaBridgeWithStemmingLanguageFromLocale),
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
					}, javaBridge as unknown as JavaBridgeWithStemmingLanguageFromLocale),
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
					}, javaBridge as unknown as JavaBridgeWithStemmingLanguageFromLocale),
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
					}, javaBridge as unknown as JavaBridgeWithStemmingLanguageFromLocale),
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
					}, javaBridge as unknown as JavaBridgeWithStemmingLanguageFromLocale),
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
					}, javaBridge as unknown as JavaBridgeWithStemmingLanguageFromLocale),
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
					}, javaBridge as unknown as JavaBridgeWithStemmingLanguageFromLocale),
					{
						message: "update: parameter 'documentTypeId' is not a string!",
						name: 'TypeError'
					}
				);
			}); // it
			it(`when requireValid=true and invalid`, () => {
				//javaBridge.log.info('CREATED_COLLECTION_NODE:%s', CREATED_COLLECTION_NODE);
				//javaBridge.log.info('CREATED_DOCUMENT_TYPE_NODE:%s', CREATED_DOCUMENT_TYPE_NODE);
				//javaBridge.log.info("CREATED_DOCUMENT_TYPE_NODE['properties']:%s", CREATED_DOCUMENT_TYPE_NODE['properties']);
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
					}, javaBridge as unknown as JavaBridgeWithStemmingLanguageFromLocale),
					{
						message: /validation failed/,
						name: 'Error'
					}
				);
			}); // it
		}); // describe throws

		describe('modifies document node', () => {
			it(`modifies data, but not under ${FieldPath.META} nor ${FieldPath.GLOBAL}`, () => {
				//javaBridge.log.info('CREATED_DOCUMENT_NODE:%s', CREATED_DOCUMENT_NODE);
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
				}, javaBridge as unknown as JavaBridgeWithStemmingLanguageFromLocale);
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
				//javaBridge.log.info('CREATED_DOCUMENT_NODE:%s', CREATED_DOCUMENT_NODE);
				//javaBridge.log.info('CREATED_DOCUMENT_NODE._indexConfig.configs:%s', CREATED_DOCUMENT_NODE._indexConfig.configs);
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
				}, javaBridge as unknown as JavaBridgeWithStemmingLanguageFromLocale);
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
