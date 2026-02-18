import type { sanitize } from '@enonic-types/lib-common';
import type { WriteConnection } from '../types.d';


import { ROOT_PERMISSIONS_EXPLORER } from '@enonic/explorer-utils';
import {
	Log,
	Server,
} from '@enonic/mock-xp';
import {
	describe,
	expect,
	jest,
	test as it
} from '@jest/globals';
import { modify } from './modify';


const server = new Server({
	loglevel: 'silent'
}).createRepo({
	id: 'com.enonic.app.explorer'
});

// eslint-disable-next-line @typescript-eslint/no-namespace
declare module globalThis {
	let log: Log
}

globalThis.log = server.log;

const writeConnection = server.connect({
	branchId: 'master',
	repoId: 'com.enonic.app.explorer',
}) as unknown as WriteConnection;

const createdNode = writeConnection.create({
	_name: 'node_name',
});

// log.debug('createdNode:%s', createdNode);

jest.mock('/lib/xp/common', () => ({
	sanitize: jest.fn<typeof sanitize>((text) => text)
}), { virtual: true });

describe('node', () => {
	describe('modify()', () => {
		it('fixes missing permissions', () => {
			const modifyRes = modify({
				_id: createdNode._id,
			}, {
				connection: writeConnection,
			});
			// log.debug('modifyRes:%s', modifyRes);
			expect(modifyRes['_permissions']).toStrictEqual(ROOT_PERMISSIONS_EXPLORER);
		});
	});
});
