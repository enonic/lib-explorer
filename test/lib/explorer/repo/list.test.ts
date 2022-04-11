import {toStr} from '@enonic/js-utils/dist/cjs/value/toStr';
import {JavaBridge} from '@enonic/mock-xp';
import {deepStrictEqual} from 'assert';

import {
	COLLECTION_REPO_PREFIX,
	repo
} from '../../../../build/rollup/index.js';
import {log} from '../../../dummies';
import {COLLECTION_NAME} from '../../../testData';

const {list} = repo;


const javaBridge = new JavaBridge({
	app: {
		config: {},
		name: 'com.enonic.app.explorer',
		version: '0.0.1-SNAPSHOT'
	},
	log
});
javaBridge.repo.create({
	id: 'system-repo'
});
javaBridge.repo.create({
	id: 'com.enonic.cms.default'
});
javaBridge.repo.createBranch({
	branchId: 'draft',
	repoId: 'com.enonic.cms.default'
});
javaBridge.repo.create({
	id: 'com.enonic.app.explorer'
});
const REPO_ID = `${COLLECTION_REPO_PREFIX}${COLLECTION_NAME}`;
javaBridge.repo.create({
	id: REPO_ID
});

describe('repo', () => {
	describe('list()', () => {
		it(`list({}) --> all repos`, () => {
			deepStrictEqual(
				[{
					id: 'system-repo',
					branches: ['master'],
					settings: {}
				},{
					id: 'com.enonic.cms.default',
					branches: ['master','draft'],
					settings: {}
				},{
					id: 'com.enonic.app.explorer',
					branches: ['master'],
					settings: {}
				},{
					id: REPO_ID,
					branches: ['master'],
					settings: {}
				}],
				list({}, javaBridge)
			);
		});
		it(`list({ branch: 'master' }) --> all repos`, () => {
			deepStrictEqual(
				[{
					id: 'system-repo',
					branches: ['master'],
					settings: {}
				},{
					id: 'com.enonic.cms.default',
					branches: ['master','draft'],
					settings: {}
				},{
					id: 'com.enonic.app.explorer',
					branches: ['master'],
					settings: {}
				},{
					id: REPO_ID,
					branches: ['master'],
					settings: {}
				}],
				list({
					branch: 'master',
				}, javaBridge)
			);
		});
		it(`list({ branches: ['master', 'draft'] }) --> all repos`, () => {
			deepStrictEqual(
				[{
					id: 'system-repo',
					branches: ['master'],
					settings: {}
				},{
					id: 'com.enonic.cms.default',
					branches: ['master','draft'],
					settings: {}
				},{
					id: 'com.enonic.app.explorer',
					branches: ['master'],
					settings: {}
				},{
					id: REPO_ID,
					branches: ['master'],
					settings: {}
				}],
				list({
					branches: ['master', 'draft'],
				}, javaBridge)
			);
		});
		it(`list({ branch: 'draft' }) --> only cms repo`, () => {
			deepStrictEqual(
				[{
					id: 'com.enonic.cms.default',
					branches: ['master','draft'],
					settings: {}
				}],
				list({
					branch: 'draft'
				}, javaBridge)
			);
		});
		it(`list({ idStartsWith: 'com.enonic.app.explorer' }) --> only repos starting with com.enonic.app.explorer`, () => {
			deepStrictEqual(
				[{
					id: 'com.enonic.app.explorer',
					branches: ['master'],
					settings: {}
				},{
					id: REPO_ID,
					branches: ['master'],
					settings: {}
				}],
				list({
					idStartsWith: 'com.enonic.app.explorer'
				}, javaBridge)
			);
		});
		it(`list({ branch: 'draft', idStartsWith: 'com.enonic.app.explorer' }) --> no repos`, () => {
			deepStrictEqual(
				[],
				list({
					branch: 'draft',
					idStartsWith: 'com.enonic.app.explorer'
				}, javaBridge)
			);
		});
	}); // describe list()
}); // describe repo
