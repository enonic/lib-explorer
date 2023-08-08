import type { sanitize } from '@enonic-types/lib-common';
import type { WriteConnection } from '/lib/explorer/types/index.d';


import { ROOT_PERMISSIONS_EXPLORER } from '@enonic/explorer-utils';
import { JavaBridge } from '@enonic/mock-xp';
import Log from '@enonic/mock-xp/src/Log';
import {
	describe,
	expect,
	jest,
	test as it
} from '@jest/globals';
import { modify } from '../../../../src/main/resources/lib/explorer/node/modify';


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
