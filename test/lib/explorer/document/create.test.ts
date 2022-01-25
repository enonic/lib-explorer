import type {LooseObject} from '../../../types';

//import {enonify} from '@enonic/js-utils/src';
import {JavaBridge} from '@enonic/js-utils/src/mock/JavaBridge';
import {
	deepStrictEqual,
	throws
} from 'assert';

import {
	COLLECTION_REPO_PREFIX,
	document
} from '../../../../build/rollup/index.js';
import {
	COLLECTION,
	COLLECTION_LANGUAGE,
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

const {create} = document;


const javaBridge = new JavaBridge({
	app: {
		config: {},
		name: 'com.enonic.app.explorer',
		version: '0.0.1-SNAPSHOT'
	},
	log
});
//javaBridge.log.info('Yes this works!');
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
//const queryRes = connection.query({});
//const nodes = queryRes.hits.map(({id}) => connection.get(id));
//javaBridge.log.info('nodes:%s', nodes);

//@ts-ignore
javaBridge.stemmingLanguageFromLocale = (locale :string) => {
	if (locale === 'en-GB') {
		return 'en';
	}
	return 'en';
}

describe('document', () => {
	describe('create()', () => {
		it(`throws on missing parameter object`, () => {
			throws(
				() => create(undefined, javaBridge),
				{
					message: 'create: parameter object is missing!',
					name: 'Error'
				}
			);
		}); // it
		it(`throws if both collectionName and collectionId are missing`, () => {
			throws(
				() => create({
					documentTypeName: DOCUMENT_TYPE_NAME
				}, javaBridge),
				{
					message: "create: either provide collectionName or collectionId!",
					name: 'Error'
				}
			);
		}); // it
		it(`throws if both documentTypeName, documentTypeId and collectionId are missing`, () => {
			throws(
				() => create({
					collectionName: COLLECTION_NAME
				}, javaBridge),
				{
					message: "create: either provide documentTypeName, documentTypeId or collectionId!",
					name: 'Error'
				}
			);
		}); // it
		it(`throws when collectionId is not an uuidv4 string`, () => {
			throws(
				() => create({
					collectionId: '',
					collectorId: COLLECTOR_ID,
					collectorVersion: COLLECTOR_VERSION
				}, javaBridge),
				{
					message: "create: parameter 'collectionId' is not an uuidv4 string!",
					name: 'TypeError'
				}
			);
		}); // it
		it(`throws on missing collectorId`, () => {
			throws(
				() => create({
					collectionId: CREATED_COLLECTION_NODE._id
				}, javaBridge),
				{
					message: "create: required parameter 'collectorId' is missing!",
					name: 'Error'
				}
			);
		}); // it
		it(`throws when collectorId is not a string`, () => {
			throws(
				() => create({
					collectionId: CREATED_COLLECTION_NODE._id,
					collectorId: 0,
					collectorVersion: COLLECTOR_VERSION
				}, javaBridge),
				{
					message: "create: parameter 'collectorId' is not a string!",
					name: 'TypeError'
				}
			);
		}); // it
		it(`throws on missing collectorVersion`, () => {
			throws(
				() => create({
					collectionId: CREATED_COLLECTION_NODE._id,
					collectorId: COLLECTOR_ID
				}, javaBridge),
				{
					message: "create: required parameter 'collectorVersion' is missing!",
					name: 'Error'
				}
			);
		}); // it
		it(`throws when collectorVersion is not a string`, () => {
			throws(
				() => create({
					collectionId: CREATED_COLLECTION_NODE._id,
					collectorId: COLLECTOR_ID,
					collectorVersion: 0
				}, javaBridge),
				{
					message: "create: parameter 'collectorVersion' is not a string!",
					name: 'TypeError'
				}
			);
		}); // it
		it(`is able to get collectionName, documentTypeId, documentTypeName, language and stemmmingLanguage from collectionId`, () => {
			const _indexConfig = JSON.parse(JSON.stringify(INDEX_CONFIG));
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
			_indexConfig.configs.push({
					path: 'myString',
					config: {
						decideByType: false,
						enabled: true,
						fulltext: true,
						includeInAllText: true,
						languages: [COLLECTION_STEMMING_LANGUAGE],
						nGram: true,
						path: false
					}
				});
			const createRes = create({
				// Input
				collectionId: CREATED_COLLECTION_NODE._id,
				collectorId: COLLECTOR_ID,
				collectorVersion: COLLECTOR_VERSION,
				data: {
					myString: 'string',
					extra: 'extra'
				},
				// Options
				//addExtraFields, // default is !cleanExtraFields
				//cleanExtraFields: false, // default is false
				//cleanExtraFields: true,
				requireValid: true,
				validateOccurrences: true//, // default is false
				//validateTypes: true // default is same as requireValid
			}, javaBridge);
			//javaBridge.log.info('createRes:%s', createRes);
			deepStrictEqual(
				{
					_id: createRes._id,
					_indexConfig,
					_name: createRes._id,
					_nodeType: 'default',
					_state: 'DEFAULT',
					_ts: createRes._ts,
					_versionKey: createRes._versionKey,
					document_metadata: {
						collection: COLLECTION_NAME,
						collector: {
							id: COLLECTOR_ID,
							version: COLLECTOR_VERSION
						},
						createdTime: createRes.document_metadata.createdTime,
						documentType: DOCUMENT_TYPE_NAME,
						language: COLLECTION_LANGUAGE,
						stemmingLanguage: COLLECTION_STEMMING_LANGUAGE,
						valid: true
					},
					extra: 'extra',
					myString: 'string'
				},
				createRes
			) // deepStrictEqual
		}); // it
		it("is able to do it's thing without connecting to the explorer repo WHEN enough info is provided in the parameters", () => {
			const _indexConfig = JSON.parse(JSON.stringify(INDEX_CONFIG));
			_indexConfig.configs.push({
					path: 'myString',
					config: {
						decideByType: false,
						enabled: true,
						fulltext: true,
						includeInAllText: true,
						languages: [COLLECTION_STEMMING_LANGUAGE],
						nGram: true,
						path: false
					}
				});
				const createRes = create({
					collectionName: COLLECTION_NAME,
					collectorId: COLLECTOR_ID,
					collectorVersion: COLLECTOR_VERSION,
					data: {
						document_metadata: {
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
				}, javaBridge); // create
			deepStrictEqual(
				{
					_id: createRes._id,
					_indexConfig,
					_name: createRes._id,
					_nodeType: 'default',
					_state: 'DEFAULT',
					_ts: createRes._ts,
					_versionKey: createRes._versionKey,
					document_metadata: {
						collection: COLLECTION_NAME,
						collector: {
							id: COLLECTOR_ID,
							version: COLLECTOR_VERSION
						},
						createdTime: createRes.document_metadata.createdTime,
						documentType: DOCUMENT_TYPE_NAME,
						language: COLLECTION_LANGUAGE,
						stemmingLanguage: COLLECTION_STEMMING_LANGUAGE,
						valid: true
					},
					myString: 'string'
				},
				createRes
			) // deepStrictEqual
		}); // it
	}); // describe create
}); // describe document
