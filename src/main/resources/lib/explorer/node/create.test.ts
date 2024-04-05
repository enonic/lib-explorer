import type { WriteConnection } from '/lib/explorer/types/index.d';
import type {
	UserKey,
	getUser
} from '@enonic-types/lib-auth';
import type { sanitize } from '@enonic-types/lib-common';


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
import { create } from './create';


const server = new Server({
	loglevel: 'silent',
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

jest.mock('/lib/xp/auth', () => ({
	getUser: jest.fn<typeof getUser>().mockReturnValue({
		displayName: 'System Administrator',
		key: 'user:system:su' as UserKey,
		login: 'su',
		disabled: false,
		// email: ,
		modifiedTime: '1970-01-01T00:00:00Z',
		idProvider: 'system',
		type: 'user' as const,
	})
}), { virtual: true });

jest.mock('/lib/xp/common', () => ({
	sanitize: jest.fn<typeof sanitize>((text) => text)
}), { virtual: true });


describe('node', () => {
	describe('create()', () => {
		it('ensures a minimum of permissions', () => {
			const createRes = create({
				_name: 'node_name1',
				_permissions: []
			}, {
				connection: writeConnection
			});
			// log.debug('createRes:%s', createRes);
			expect(createRes['_permissions']).toStrictEqual(ROOT_PERMISSIONS_EXPLORER);
		});
		it("warns and doesn't allow other principals write access", () => {
			const createRes = create({
				_name: 'node_name2',
				_permissions: [{
					principal: 'user:system:cwe',
					allow: [
						'CREATE',
						'DELETE',
						'MODIFY',
						'PUBLISH',
						'READ',
						'READ_PERMISSIONS',
						'WRITE_PERMISSIONS'
					]
				}]
			}, {
				connection: writeConnection
			});
			// log.debug('createRes:%s', createRes);
			expect(createRes['_permissions']).toStrictEqual([
				...ROOT_PERMISSIONS_EXPLORER,
				{
					principal: 'user:system:cwe',
					allow: 'READ'
				}
			]);
		});
	});
});
