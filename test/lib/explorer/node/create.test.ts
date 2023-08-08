import type { WriteConnection } from '/lib/explorer/types/index.d';
import type {
	UserKey,
	getUser
} from '@enonic-types/lib-auth';
import type { sanitize } from '@enonic-types/lib-common';


import { ROOT_PERMISSIONS_EXPLORER } from '@enonic/explorer-utils';
import { JavaBridge } from '@enonic/mock-xp';
import Log from '@enonic/mock-xp/src/Log';
import {
	describe,
	expect,
	jest,
	test as it
} from '@jest/globals';
import { create } from '../../../../src/main/resources/lib/explorer/node/create';


const log = Log.createLogger({
	// loglevel: 'debug'
	loglevel: 'silent'
});
// @ts-expect-error TS2339: Property 'log' does not exist on type 'typeof globalThis'.
global.log = log;
const javaBridge = new JavaBridge({
	app: {
		config: {},
		name: 'com.enonic.app.explorer',
		version: '0.0.1-SNAPSHOT'
	},
	log
});
javaBridge.repo.create({
	id: 'com.enonic.app.explorer'
});
const writeConnection = javaBridge.connect({
	branch: 'master',
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
