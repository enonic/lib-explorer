import type { JavaBridge as JavaBridgeWithStemmingLanguageFromLocale } from '../../../../../src/main/resources/lib/explorer/_coupling/types';


import {forceArray} from '@enonic/js-utils/array/forceArray';
import {sortByProperty} from '@enonic/js-utils/array/sortBy';
import {VALUE_TYPE_STRING} from '@enonic/js-utils/storage/indexing/valueType/constants';
import {JavaBridge} from '@enonic/mock-xp';

import {deepStrictEqual} from 'assert';

import {
	COLLECTION_REPO_PREFIX,
	FieldPath
} from '@enonic/explorer-utils';
import { create } from '../../../../../src/main/resources/lib/explorer/_uncoupled/document/create';
import { update } from '../../../../../src/main/resources/lib/explorer/_uncoupled/document/update';

import {
	COLLECTION,
	COLLECTION_NAME,
	COLLECTION_STEMMING_LANGUAGE,
	COLLECTIONS_FOLDER,
	COLLECTOR_ID,
	COLLECTOR_VERSION,
	DOCUMENT_TYPE,
	DOCUMENT_TYPES_FOLDER
} from '../../../../testData';
import {log} from '../../../../dummies';


const javaBridge = new JavaBridge({
	app: {
		config: {},
		name: 'com.enonic.app.explorer',
		version: '0.0.1-SNAPSHOT'
	},
	log
}) as unknown as JavaBridgeWithStemmingLanguageFromLocale;
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
//javaBridge.log.info('CREATED_DOCUMENT_TYPE_NODE:%s', CREATED_DOCUMENT_TYPE_NODE);

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
}, javaBridge);

const MODIFIED_DOCUMENT_TYPE_NODE = connection.modify({
	key: CREATED_DOCUMENT_TYPE_NODE._id,
	editor: (node) => {
		//javaBridge.log.info('node:%s', node);
		const properties = forceArray(node['properties']);
		//javaBridge.log.info('properties:%s', properties);
		properties.push({
			enabled: true,
			fulltext: true,
			includeInAllText: true,
			name: 'newStringField',
			nGram: true,
			path: false,
			valueType: VALUE_TYPE_STRING
		});
		node['properties'] = properties;
		//javaBridge.log.info('node:%s', node);
		return node;
	}
});
//javaBridge.log.info('MODIFIED_DOCUMENT_TYPE_NODE:%s', MODIFIED_DOCUMENT_TYPE_NODE);

describe('document', () => {
	describe('update()', () => {
		it('modifies indexConfig when documentType is changed, even though data is unchanged', () => {
			const _indexConfig = JSON.parse(JSON.stringify(CREATED_DOCUMENT_NODE._indexConfig));
			//javaBridge.log.info('_indexConfig:%s', _indexConfig);
			_indexConfig.configs.push({
				path: 'newStringField',
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
			_indexConfig.configs = sortByProperty(_indexConfig.configs, 'path');
			//javaBridge.log.info('_indexConfig:%s', _indexConfig);
			const updateRes = update({
				collectionId: CREATED_COLLECTION_NODE._id,
				collectorId: COLLECTOR_ID,
				collectorVersion: COLLECTOR_VERSION,
				data: {
					_id: CREATED_DOCUMENT_NODE._id
				},
				partial: true
			}, javaBridge);
			deepStrictEqual(
				{
					...CREATED_DOCUMENT_NODE,
					_indexConfig,
					[FieldPath.META]: {
						...CREATED_DOCUMENT_NODE[FieldPath.META],
						modifiedTime: updateRes[FieldPath.META].modifiedTime
					}
				},
				updateRes
			);
		}); // it
	}); // describe update()
}); // describe document
