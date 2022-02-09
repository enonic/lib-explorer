import {JavaBridge} from '@enonic/js-utils/src/mock/JavaBridge';
import {
	deepStrictEqual,
	throws
} from 'assert';
import {
	COLLECTION_REPO_PREFIX,
	//FIELD_PATH_GLOBAL,
	//FIELD_PATH_META,
	document
} from '../../../../build/rollup/index.js';
import {
	COLLECTION,
	COLLECTION_NAME,
	COLLECTIONS_FOLDER,
	COLLECTOR_ID,
	COLLECTOR_VERSION,
	DOCUMENT_TYPE,
	DOCUMENT_TYPES_FOLDER
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
		describe('throws', () => {
			it(`when a non existant _id is passed in`, () => {
				throws(
					() => createOrUpdate({
						collectionId: CREATED_COLLECTION_NODE._id,
						collectorId: COLLECTOR_ID,
						collectorVersion: COLLECTOR_VERSION,
						data: {
							_id: 'ffffffff-ffff-4fff-8fff-fffffffffff2' // nonExistant
						}
					}, javaBridge),
					{
						message: 'update: No document with _id:ffffffff-ffff-4fff-8fff-fffffffffff2',
						name: 'Error'
					}
				);
			}); // it
		}); // describe throws
		const createRes = createOrUpdate({
			collectionId: CREATED_COLLECTION_NODE._id,
			collectorId: COLLECTOR_ID,
			collectorVersion: COLLECTOR_VERSION/*,
			data: {
				myString: 'string'
			}*/
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
