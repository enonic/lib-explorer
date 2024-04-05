import type { send } from '@enonic-types/lib-event';
import type { connect } from '@enonic-types/lib-node';


import {forceArray} from '@enonic/js-utils/array/forceArray';
import {sortByProperty} from '@enonic/js-utils/array/sortBy';
import {VALUE_TYPE_STRING} from '@enonic/js-utils/storage/indexing/valueType/constants';
import {
	LibEvent,
	LibNode,
	LibValue,
	Log,
	Server
} from '@enonic/mock-xp';
import {
	describe,
	expect,
	jest,
	test as it
} from '@jest/globals';
import {
	COLLECTION_REPO_PREFIX,
	FieldPath
} from '@enonic/explorer-utils';
import { create } from '../create';
import { update } from '../update';
import {
	COLLECTION,
	COLLECTION_NAME,
	// COLLECTION_STEMMING_LANGUAGE,
	COLLECTIONS_FOLDER,
	COLLECTOR_ID,
	COLLECTOR_VERSION,
	DOCUMENT_TYPE,
	DOCUMENT_TYPES_FOLDER
} from '../../../../../../../test/testData';


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

const connection = server.connect({
	branchId: 'master',
	repoId: 'com.enonic.app.explorer',
});
connection.create(COLLECTIONS_FOLDER);
connection.create(DOCUMENT_TYPES_FOLDER);

const CREATED_DOCUMENT_TYPE_NODE = connection.create(DOCUMENT_TYPE);
//javaBridge.log.info('CREATED_DOCUMENT_TYPE_NODE:%s', CREATED_DOCUMENT_TYPE_NODE);

const CREATED_COLLECTION_NODE = connection.create({
	...COLLECTION,
	documentTypeId: CREATED_DOCUMENT_TYPE_NODE._id,
});


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
});

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
					// languages: [COLLECTION_STEMMING_LANGUAGE], // Only when stemmed is true and language passed.
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
			});
			expect(updateRes).toStrictEqual({
				...CREATED_DOCUMENT_NODE,
				_indexConfig,
				_versionKey: updateRes._versionKey,
				[FieldPath.META]: {
					...CREATED_DOCUMENT_NODE[FieldPath.META],
					modifiedTime: updateRes[FieldPath.META].modifiedTime
				}
			});
		}); // it
	}); // describe update()
}); // describe document
