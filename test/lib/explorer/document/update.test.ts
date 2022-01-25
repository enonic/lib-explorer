import type {LooseObject} from '../../../types';

import {JavaBridge} from '@enonic/js-utils/src/mock/JavaBridge';

import {sortByProperty} from '@enonic/js-utils';
import {
	deepStrictEqual,
	throws
} from 'assert';

import {
	COLLECTION_REPO_PREFIX,
	FIELD_PATH_GLOBAL,
	FIELD_PATH_META,
	document
} from '../../../../build/rollup/index.js';
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
import {log} from '../../../dummies';

const {
	create,
	update
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
		languages: [COLLECTION_STEMMING_LANGUAGE],
		//languages: COLLECTION_STEMMING_LANGUAGE, // enonified
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
	}
}, javaBridge);
//javaBridge.log.info('CREATED_DOCUMENT_NODE:%s', CREATED_DOCUMENT_NODE);
/*const queryRes = connection.query({});
const nodes = queryRes.hits.map(({id}) => connection.get(id));
javaBridge.log.info('nodes:%s', nodes);*/

describe('document', () => {
	describe('update()', () => {
		it(`throws on missing parameter object`, () => {
			throws(
				() => update(undefined, javaBridge),
				{
					message: 'update: parameter object is missing!',
					name: 'Error'
				}
			);
		}); // it
		it(`throws if data is missing`, () => {
			throws(
				() => update({}, javaBridge),
				{
					message: "update: missing required parameter data!",
					name: 'Error'
				}
			);
		}); // it
		it(`throws if data doesn't contain _id`, () => {
			throws(
				() => update({
					collectionName: COLLECTION_NAME,
					collectorId: COLLECTOR_ID,
					collectorVersion: COLLECTOR_VERSION,
					documentTypeName: DOCUMENT_TYPE_NAME,
					data: {},
					fields: DOCUMENT_TYPE_FIELDS//,
					//language: COLLECTION_LANGUAGE
				}, javaBridge),
				{
					message: "update: parameter data: missing required property '_id'!",
					name: 'Error'
				}
			);
		}); // it
		it(`throws if data._id not uuidv4 string`, () => {
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
				}, javaBridge),
				{
					message: "update: parameter data: property '_id' is not an uuidv4 string!",
					name: 'TypeError'
				}
			);
		}); // it
		it(`throws if both collectionName and collectionId are missing`, () => {
			throws(
				() => update({
					data: CREATED_DOCUMENT_NODE
				}, javaBridge),
				{
					message: "update: either provide collectionName or collectionId!",
					name: 'Error'
				}
			);
		}); // it
		it(`throws if both documentTypeName, documentTypeId and collectionId are missing`, () => {
			throws(
				() => update({
					collectionName: COLLECTION_NAME,
					data: CREATED_DOCUMENT_NODE
				}, javaBridge),
				{
					message: "update: either provide documentTypeName, documentTypeId or collectionId!",
					name: 'Error'
				}
			);
		}); // it
		it(`throws if both fields, documentTypeId and collectionId are missing`, () => {
			throws(
				() => update({
					collectionName: COLLECTION_NAME,
					documentTypeName: DOCUMENT_TYPE_NAME,
					data: CREATED_DOCUMENT_NODE
				}, javaBridge),
				{
					message: "update: either provide fields, documentTypeId or collectionId!",
					name: 'Error'
				}
			);
		}); // it
		it(`throws on missing collectorId`, () => {
			throws(
				() => update({
					collectionId: CREATED_COLLECTION_NODE._id,
					data: CREATED_DOCUMENT_NODE
				}, javaBridge),
				{
					message: "update: required parameter 'collectorId' is missing!",
					name: 'Error'
				}
			);
		}); // it
		it(`throws when collectorId is not a string`, () => {
			throws(
				() => update({
					collectionId: CREATED_COLLECTION_NODE._id,
					collectorId: 0,
					collectorVersion: COLLECTOR_VERSION,
					data: CREATED_DOCUMENT_NODE
				}, javaBridge),
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
					data: CREATED_DOCUMENT_NODE
				}, javaBridge),
				{
					message: "update: required parameter 'collectorVersion' is missing!",
					name: 'Error'
				}
			);
		}); // it
		it(`throws when collectorVersion is not a string`, () => {
			throws(
				() => update({
					collectionId: CREATED_COLLECTION_NODE._id,
					collectorId: COLLECTOR_ID,
					collectorVersion: 0,
					data: CREATED_DOCUMENT_NODE
				}, javaBridge),
				{
					message: "update: parameter 'collectorVersion' is not a string!",
					name: 'TypeError'
				}
			);
		}); // it
		it(`throws when collectionId is not an uuidv4 string`, () => {
			throws(
				() => update({
					collectionId: '',
					collectorId: COLLECTOR_ID,
					collectorVersion: COLLECTOR_VERSION,
					data: CREATED_DOCUMENT_NODE
				}, javaBridge),
				{
					message: "update: parameter 'collectionId' is not an uuidv4 string!",
					name: 'TypeError'
				}
			);
		}); // it
		it(`throws when collectionName is not a string`, () => {
			throws(
				() => update({
					collectionName: true, // !string
					collectorId: COLLECTOR_ID,
					collectorVersion: COLLECTOR_VERSION,
					data: CREATED_DOCUMENT_NODE,
					documentTypeName: DOCUMENT_TYPE_NAME,
					fields: DOCUMENT_TYPE_FIELDS
				}, javaBridge),
				{
					message: "update: parameter 'collectionName' is not a string!",
					name: 'TypeError'
				}
			);
		}); // it
		it(`throws when documentTypeName is not a string`, () => {
			throws(
				() => update({
					collectionName: COLLECTION_NAME,
					collectorId: COLLECTOR_ID,
					collectorVersion: COLLECTOR_VERSION,
					data: CREATED_DOCUMENT_NODE,
					documentTypeName: true, // !string
					fields: DOCUMENT_TYPE_FIELDS
				}, javaBridge),
				{
					message: "update: parameter 'documentTypeName' is not a string!",
					name: 'TypeError'
				}
			);
		}); // it
		it(`throws when documentTypeId is not a string`, () => {
			throws(
				() => update({
					collectionName: COLLECTION_NAME,
					collectorId: COLLECTOR_ID,
					collectorVersion: COLLECTOR_VERSION,
					data: CREATED_DOCUMENT_NODE,
					documentTypeId: true, // !string
					fields: DOCUMENT_TYPE_FIELDS
				}, javaBridge),
				{
					message: "update: parameter 'documentTypeId' is not a string!",
					name: 'TypeError'
				}
			);
		}); // it
		it(`modifies data, but not under ${FIELD_PATH_META} nor ${FIELD_PATH_GLOBAL}`, () => {
			//javaBridge.log.info('CREATED_DOCUMENT_NODE:%s', CREATED_DOCUMENT_NODE);
			const updateRes = update({
				collectionId: CREATED_COLLECTION_NODE._id,
				collectorId: COLLECTOR_ID,
				collectorVersion: COLLECTOR_VERSION,
				data: {
					_id: CREATED_DOCUMENT_NODE._id,
					[FIELD_PATH_GLOBAL]: {
						illegal: 'shouldBeCleaned'
					},
					[FIELD_PATH_META]: {
						createdTime: 'createdTime',
						illegal: 'shouldBeCleaned'
					},
					myString: 'myStringChanged'
				}
			}, javaBridge);
			deepStrictEqual(
				{
					_id: CREATED_DOCUMENT_NODE._id,
					_indexConfig: CREATED_DOCUMENT_NODE._indexConfig,
					[FIELD_PATH_META]: {
						collection: 'myCollectionName',
						collector: {
							id: COLLECTOR_ID,
							version: COLLECTOR_VERSION
						},
						createdTime: CREATED_DOCUMENT_NODE[FIELD_PATH_META].createdTime,
						documentType: 'myDocumentTypeName',
						language: 'en-GB',
						modifiedTime: updateRes[FIELD_PATH_META].modifiedTime,
						stemmingLanguage: 'en',
						valid: true
					},
					myString: 'myStringChanged'
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
					[FIELD_PATH_META]: {
						createdTime: 'createdTime'
					},
					myString: 'myStringChanged',
					extra: 'extraAdded'
				}
			}, javaBridge);
			const _indexConfig = JSON.parse(JSON.stringify(CREATED_DOCUMENT_NODE._indexConfig));
			_indexConfig.configs.push({
				path: 'extra',
				config: {
					decideByType: false,
					enabled: true,
					fulltext: false,
					includeInAllText: false,
					languages: [COLLECTION_STEMMING_LANGUAGE],
					nGram: false,
					path: false
				}
			});
			_indexConfig.configs = sortByProperty(_indexConfig.configs, 'path');
			deepStrictEqual(
				{
					_id: CREATED_DOCUMENT_NODE._id,
					_indexConfig,
					[FIELD_PATH_META]: {
						collection: 'myCollectionName',
						collector: {
							id: COLLECTOR_ID,
							version: COLLECTOR_VERSION
						},
						createdTime: CREATED_DOCUMENT_NODE[FIELD_PATH_META].createdTime,
						documentType: 'myDocumentTypeName',
						language: 'en-GB',
						modifiedTime: updateRes[FIELD_PATH_META].modifiedTime,
						stemmingLanguage: 'en',
						valid: true
					},
					extra: 'extraAdded',
					myString: 'myStringChanged'
				},
				updateRes
			) // deepStrictEqual
		}); // it
	}); // describe create
}); // describe document
