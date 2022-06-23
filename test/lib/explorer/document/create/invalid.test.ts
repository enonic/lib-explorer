import {
	VALUE_TYPE_BOOLEAN,
	VALUE_TYPE_DOUBLE,
	VALUE_TYPE_STRING
} from '@enonic/js-utils/dist/cjs/storage/indexing/valueType/constants';
import {JavaBridge} from '@enonic/mock-xp';
import {
	deepStrictEqual//,
	//throws
} from 'assert';

import {
	COLLECTION_REPO_PREFIX,
	//FIELD_PATH_GLOBAL,
	FIELD_PATH_META,
	NT_DOCUMENT,
	document
} from '../../../../../build/rollup/index.js';
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
			//javaBridge.log.info('myDocumentTypeNode2:%s', myDocumentTypeNode2);

			const myCollectionNode2 = connection.create({
				_name: 'myCollectionName2',
				_path: `${COLLECTIONS_FOLDER_PATH}/myCollectionName2`,
				documentTypeId: myDocumentTypeNode2._id,
				language: COLLECTION_LANGUAGE,
			});
			//javaBridge.log.info('myCollectionNode2:%s', myCollectionNode2);
			//javaBridge.log.info('myDocumentTypeNode2.properties:%s', myDocumentTypeNode2['properties']);

			javaBridge.repo.create({
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
				}, javaBridge);
				//javaBridge.log.info('createRes:%s', createRes);

				deepStrictEqual(
					{
						_id: createRes._id,
						_indexConfig: createRes._indexConfig,
						_name: createRes._id,
						_nodeType: NT_DOCUMENT,
						_path: createRes._path,
						_state: 'DEFAULT',
						_ts: createRes._ts,
						_versionKey: createRes._versionKey,
						[FIELD_PATH_META]: {
							collection: 'myCollectionName2',
							collector: {
								id: COLLECTOR_ID,
								version: COLLECTOR_VERSION
							},
							createdTime: createRes[FIELD_PATH_META].createdTime,
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
				}, javaBridge);
				//javaBridge.log.info('createRes:%s', createRes);

				deepStrictEqual(
					{
						_id: createRes._id,
						_indexConfig: createRes._indexConfig,
						_name: createRes._id,
						_nodeType: NT_DOCUMENT,
						_path: createRes._path,
						_state: 'DEFAULT',
						_ts: createRes._ts,
						_versionKey: createRes._versionKey,
						[FIELD_PATH_META]: {
							collection: 'myCollectionName2',
							collector: {
								id: COLLECTOR_ID,
								version: COLLECTOR_VERSION
							},
							createdTime: createRes[FIELD_PATH_META].createdTime,
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
