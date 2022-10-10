import {JavaBridge} from '@enonic/mock-xp';
import {deepStrictEqual} from 'assert';

import {
	COLLECTION_REPO_PREFIX,
	FIELD_PATH_META,
	NT_DOCUMENT,
	document
} from '../../../../../build/rollup/index.js';
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
} from '../../../../testData';
import {log} from '../../../../dummies';

const {create} = document;


const javaBridge = new JavaBridge({
	app: {
		config: {},
		name: 'com.enonic.app.explorer',
		version: '0.0.1-SNAPSHOT'
	},
	log
});
javaBridge.repo.create({id: 'com.enonic.app.explorer'});
javaBridge.repo.create({id: `${COLLECTION_REPO_PREFIX}${COLLECTION_NAME}`});
const connection = javaBridge.connect({
	repoId: 'com.enonic.app.explorer',
	branch: 'master'
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
// javaBridge.log.info('CREATED_COLLECTION_NODE:%s', CREATED_COLLECTION_NODE);

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
				}, javaBridge);
				// javaBridge.log.info('createdDocumentNode:%s', createdDocumentNode);
				const _indexConfig = JSON.parse(JSON.stringify(INDEX_CONFIG));
				_indexConfig.configs.push({
					path: 'mystring',
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
				const expected = {
					_id: createdDocumentNode._id,
					_indexConfig,
					_name: createdDocumentNode._id,
					_nodeType: NT_DOCUMENT,
					_path: createdDocumentNode._path,
					_state: 'DEFAULT',
					_ts: createdDocumentNode._ts,
					_versionKey: createdDocumentNode._versionKey,
					[FIELD_PATH_META]: {
						collection: COLLECTION_NAME,
						collector: {
							id: COLLECTOR_ID,
							version: COLLECTOR_VERSION
						},
						createdTime: createdDocumentNode[FIELD_PATH_META].createdTime,
						documentType: DOCUMENT_TYPE_NAME,
						language: COLLECTION_LANGUAGE,
						stemmingLanguage: COLLECTION_STEMMING_LANGUAGE,
						valid: true
					},
					mystring: 'string'
				};
				deepStrictEqual(
					expected,
					createdDocumentNode
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
				}, javaBridge);
				// javaBridge.log.info('createdDocumentNode:%s', createdDocumentNode);
				const _indexConfig = JSON.parse(JSON.stringify(INDEX_CONFIG));
				_indexConfig.configs.push({
					path: 'mystring',
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
				const expected = {
					_id: createdDocumentNode._id,
					_indexConfig,
					_name: createdDocumentNode._id,
					_nodeType: NT_DOCUMENT,
					_path: createdDocumentNode._path,
					_state: 'DEFAULT',
					_ts: createdDocumentNode._ts,
					_versionKey: createdDocumentNode._versionKey,
					[FIELD_PATH_META]: {
						collection: COLLECTION_NAME,
						collector: {
							id: COLLECTOR_ID,
							version: COLLECTOR_VERSION
						},
						createdTime: createdDocumentNode[FIELD_PATH_META].createdTime,
						documentType: DOCUMENT_TYPE_NAME,
						language: COLLECTION_LANGUAGE,
						stemmingLanguage: COLLECTION_STEMMING_LANGUAGE,
						valid: true
					},
					mystring: 'string'
				};
				deepStrictEqual(
					expected,
					createdDocumentNode
				);
			}); // it

		}); // describe creates
	}); // describe create
}); // describe document
