import type { send } from '@enonic-types/lib-event';
import type { connect } from '@enonic-types/lib-node';


import {
	Log,
	LibEvent,
	LibNode,
	Server
} from '@enonic/mock-xp';
import {
	deepStrictEqual//,
	//throws
} from 'assert';
import {
	describe,
	// expect,
	jest,
	test as it
} from '@jest/globals';
import { update } from './update';
import {
	DOCUMENT_TYPE,
	DOCUMENT_TYPES_FOLDER
} from '../../../../../../test/testData';

// eslint-disable-next-line @typescript-eslint/no-namespace
declare module globalThis {
	let log: Log
}

const server = new Server({
	loglevel: 'silent'
}).createRepo({
	id: 'com.enonic.app.explorer'
});

globalThis.log = server.log;


const libEvent = new LibEvent({
	server
});

const libNode = new LibNode({
	server
});

const connection = libNode.connect({
	repoId: 'com.enonic.app.explorer',
	branch: 'master'
});
connection.create(DOCUMENT_TYPES_FOLDER);
const CREATED_DOCUMENT_TYPE_NODE = connection.create(DOCUMENT_TYPE);
// log.info('CREATED_DOCUMENT_TYPE_NODE:%s', CREATED_DOCUMENT_TYPE_NODE);

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

// TODO was this used for nothing?
// @ts-ignore
// javaBridge.stemmingLanguageFromLocale = (locale: string) => {
// 	if (locale === 'en-GB') {
// 		return 'en';
// 	}
// 	return 'en';
// }

describe('documentType', () => {
	describe('update()', () => {
		it('modifies the documentType', () => {
			const expected = {
				...CREATED_DOCUMENT_TYPE_NODE,
				_versionKey: '00000000-0000-4000-8000-000000000006',
				properties: []
			};
			const updateRes = update({
				_id: CREATED_DOCUMENT_TYPE_NODE._id,
				properties: []
			});
			// log.info('updateRes:%s', updateRes);
			expect(updateRes).toStrictEqual(expected);
			expect(connection.get(CREATED_DOCUMENT_TYPE_NODE._id))
				.toStrictEqual(expected);
		}); // it
	}); // describe update()
}); // describe documentType
