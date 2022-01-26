import {JavaBridge} from '@enonic/js-utils/src/mock/JavaBridge';
import {
	deepStrictEqual//,
	//throws
} from 'assert';
import {
	COLLECTION_REPO_PREFIX,
	//FIELD_PATH_GLOBAL,
	//FIELD_PATH_META,
	document
} from '../../../../build/rollup/index.js';
import {
	COLLECTION,
	COLLECTION_LANGUAGE,
	COLLECTION_NAME,
	COLLECTION_STEMMING_LANGUAGE,
	COLLECTIONS_FOLDER,
	COLLECTIONS_FOLDER_PATH,
	COLLECTOR_ID,
	COLLECTOR_VERSION,
	DOCUMENT_TYPE,
	DOCUMENT_TYPE_FIELDS,
	DOCUMENT_TYPE_NAME,
	DOCUMENT_TYPES_FOLDER,
	DOCUMENT_TYPES_FOLDER_PATH,
	INDEX_CONFIG
} from '../../../testData';
import {log} from '../../../dummies';

const {createOrUpdate} = document;

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

//@ts-ignore
javaBridge.stemmingLanguageFromLocale = (locale :string) => {
	if (locale === 'en-GB') {
		return 'en';
	}
	return 'en';
}

describe('document', () => {
	describe('createOrUpdate()', () => {
		const createRes = createOrUpdate({
			collectionId: CREATED_COLLECTION_NODE._id,
			collectorId: COLLECTOR_ID,
			collectorVersion: COLLECTOR_VERSION/*,
			data: {
				myString: 'string'
			}*/
		}, javaBridge);
		const createRes2 = createOrUpdate({
			collectionId: CREATED_COLLECTION_NODE._id,
			collectorId: COLLECTOR_ID,
			collectorVersion: COLLECTOR_VERSION,
			data: {
				_id: 'ffffffff-ffff-4fff-8fff-fffffffffff2', // nonExistant
				myString: 'string'
			}
		}, javaBridge);
		it('creates new document node when data._id is missing', () => {
			deepStrictEqual(
				{
					...createRes,
					 _id: '00000000-0000-4000-8000-000000000002'
				},
				createRes
			);
		}); // it
		it("creates new document node when no exisiting document node is found matching data._id", () => {
			deepStrictEqual(
				{
					...createRes2,
					 _id: 'ffffffff-ffff-4fff-8fff-fffffffffff2'
				},
				createRes2
			);
		}); // it
		it('updates document node when data._id is present', () => {
			const updateRes = createOrUpdate({
				collectionId: CREATED_COLLECTION_NODE._id,
				collectorId: COLLECTOR_ID,
				collectorVersion: COLLECTOR_VERSION,
				data: {
					_id: '00000000-0000-4000-8000-000000000002',
					myString: 'stringUpdated'
				}
			}, javaBridge);
			deepStrictEqual(
				{
					...updateRes,
					 _id: '00000000-0000-4000-8000-000000000002'
				},
				updateRes
			);
		}); // it
	}); // describe createOrUpdate
}); // describe document
