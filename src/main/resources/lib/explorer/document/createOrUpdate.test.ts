import type { send } from '@enonic-types/lib-event';
import type { connect } from '@enonic-types/lib-node';


import {
	LibEvent,
	LibNode,
	LibValue,
	Log,
	Server
} from '@enonic/mock-xp';
import {
	describe,
	// expect,
	jest,
	test as it
} from '@jest/globals';
import {
	deepStrictEqual,
	throws
} from 'assert';
import {
	COLLECTION_REPO_PREFIX,
} from '@enonic/explorer-utils';
import { createOrUpdate } from './createOrUpdate';
import {
	COLLECTION,
	COLLECTION_NAME,
	COLLECTIONS_FOLDER,
	COLLECTOR_ID,
	COLLECTOR_VERSION,
	DOCUMENT_TYPE,
	DOCUMENT_TYPES_FOLDER
} from '../../../../../../test/testData';


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
const CREATED_COLLECTION_NODE = connection.create({
	...COLLECTION,
	documentTypeId: CREATED_DOCUMENT_TYPE_NODE._id,
});



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
					}),
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
			collectorVersion: COLLECTOR_VERSION,
			/*data: {
				myString: 'string'
			},*/
			documentTypeId: CREATED_DOCUMENT_TYPE_NODE._id
		});
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
			});
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
