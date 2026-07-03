import type { list as listRepos } from '@enonic-types/lib-repo';

// import {toStr} from '@enonic/js-utils/value/toStr';
import {
    LibRepo,
    Log,
    Server,
} from '@enonic/mock-xp';
import {
    describe,
    // expect,
    jest,
    test as it
} from '@jest/globals';
import {deepStrictEqual} from 'assert';
import { COLLECTION_REPO_PREFIX } from '@enonic/explorer-utils';
import { list } from './list';
import {COLLECTION_NAME} from '../../../../../../test/testData';


const REPO_ID = `${COLLECTION_REPO_PREFIX}${COLLECTION_NAME}`;

const server = new Server({
    loglevel: 'silent'
}).createProject({
    projectName: 'default'
}).createRepo({
    id: 'com.enonic.app.explorer'
}).createRepo({
    id: REPO_ID
});

// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace globalThis {
	let log: Log
}

globalThis.log = server.log;

const libRepo = new LibRepo({
    server
});

jest.mock('/lib/xp/repo', () => {
    return {
        list: jest.fn<typeof listRepos>(() => libRepo.list()),
    }
}, { virtual: true });


describe('repo', () => {
    describe('list()', () => {
        it(`list({}) --> all repos`, () => {
            deepStrictEqual(
                [{
                    id: 'system-repo',
                    branches: ['master'],
                    transient: false
                },{
                    id: 'com.enonic.cms.default',
                    branches: ['master','draft'],
                    transient: false
                },{
                    id: 'com.enonic.app.explorer',
                    branches: ['master'],
                    transient: false
                },{
                    id: REPO_ID,
                    branches: ['master'],
                    transient: false
                }],
                list({})
            );
        });
        it(`list({ branch: 'master' }) --> all repos`, () => {
            deepStrictEqual(
                [{
                    id: 'system-repo',
                    branches: ['master'],
                    transient: false
                },{
                    id: 'com.enonic.cms.default',
                    branches: ['master','draft'],
                    transient: false
                },{
                    id: 'com.enonic.app.explorer',
                    branches: ['master'],
                    transient: false
                },{
                    id: REPO_ID,
                    branches: ['master'],
                    transient: false
                }],
                list({
                    branch: 'master',
                })
            );
        });
        it(`list({ branches: ['master', 'draft'] }) --> all repos`, () => {
            deepStrictEqual(
                [{
                    id: 'system-repo',
                    branches: ['master'],
                    transient: false
                },{
                    id: 'com.enonic.cms.default',
                    branches: ['master','draft'],
                    transient: false
                },{
                    id: 'com.enonic.app.explorer',
                    branches: ['master'],
                    transient: false
                },{
                    id: REPO_ID,
                    branches: ['master'],
                    transient: false
                }],
                list({
                    branches: ['master', 'draft'],
                })
            );
        });
        it(`list({ branch: 'draft' }) --> only cms repo`, () => {
            deepStrictEqual(
                [{
                    id: 'com.enonic.cms.default',
                    branches: ['master','draft'],
                    transient: false
                }],
                list({
                    branch: 'draft'
                })
            );
        });
        it(`list({ idStartsWith: 'com.enonic.app.explorer' }) --> only repos starting with com.enonic.app.explorer`, () => {
            deepStrictEqual(
                [{
                    id: 'com.enonic.app.explorer',
                    branches: ['master'],
                    transient: false
                },{
                    id: REPO_ID,
                    branches: ['master'],
                    transient: false
                }],
                list({
                    idStartsWith: 'com.enonic.app.explorer'
                })
            );
        });
        it(`list({ branch: 'draft', idStartsWith: 'com.enonic.app.explorer' }) --> no repos`, () => {
            deepStrictEqual(
                [],
                list({
                    branch: 'draft',
                    idStartsWith: 'com.enonic.app.explorer'
                })
            );
        });
    }); // describe list()
}); // describe repo
