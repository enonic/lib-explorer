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
import {throws} from 'assert';
import {
	COLLECTION_REPO_PREFIX,
} from '@enonic/explorer-utils';
import { create } from '../../create';
import {
	COLLECTION,
	COLLECTION_NAME,
	COLLECTIONS_FOLDER,
	DOCUMENT_TYPE,
	DOCUMENT_TYPES_FOLDER
} from '../../../../../../../../test/testData';



const server = new Server({
	loglevel: 'silent'
})
.createRepo({id: 'com.enonic.app.explorer'})
.createRepo({id: `${COLLECTION_REPO_PREFIX}${COLLECTION_NAME}`});

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
connection.create({
	...COLLECTION,
	documentTypeId: CREATED_DOCUMENT_TYPE_NODE._id,
});


describe('document', () => {
	describe('create()', () => {
		describe('throws', () => {
			describe('addExtraFields===true', () => {
				it(`if addExtraFields=true documentTypeName can't be determined`, () => {
					throws(
						// @ts-expect-error TS2345
						() => create({
							addExtraFields: true
						}),
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
