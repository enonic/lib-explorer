import {JavaBridge} from '@enonic/mock-xp';
import {throws} from 'assert';
import {
	COLLECTION_REPO_PREFIX,
	document
} from '../../../../../../build/rollup/index.js';
import {
	COLLECTION,
	COLLECTION_NAME,
	COLLECTIONS_FOLDER,
	DOCUMENT_TYPE,
	DOCUMENT_TYPES_FOLDER
} from '../../../../../testData';
import {log} from '../../../../../dummies';


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
connection.create(DOCUMENT_TYPES_FOLDER);
const CREATED_DOCUMENT_TYPE_NODE = connection.create(DOCUMENT_TYPE);
connection.create({
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
	describe('create()', () => {
		describe('throws', () => {
			describe('addExtraFields===true', () => {
				it(`if addExtraFields=true documentTypeName can't be determined`, () => {
					throws(
						() => create({
							addExtraFields: true
						}, javaBridge),
						{
							message: "create: when addExtraFields=true either (documentTypeName or documentTypeId) must be provided or (collectionName or collectionId and the collectionNode must contain a default documentTypeId)!",
							name: 'Error'
						}
					);
				}); // it
			}); // describe addExtraFields===true
		}); // describe throws
	}); // describe create
}); // describe document
