import {JavaBridge} from '@enonic/mock-xp';

import {
	deepStrictEqual//,
	//throws
} from 'assert';

import {documentType} from '../../../../build/rollup/index.js';
import {
	DOCUMENT_TYPE,
	DOCUMENT_TYPES_FOLDER
} from '../../../testData';
import {log} from '../../../dummies';

const {
	update
} = documentType;

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

const connection = javaBridge.connect({
	repoId: 'com.enonic.app.explorer',
	branch: 'master'
});
connection.create(DOCUMENT_TYPES_FOLDER);
const CREATED_DOCUMENT_TYPE_NODE = connection.create(DOCUMENT_TYPE);
//javaBridge.log.info('CREATED_DOCUMENT_TYPE_NODE:%s', CREATED_DOCUMENT_TYPE_NODE);

describe('documentType', () => {
	describe('update()', () => {
		it('modifies the documentType', () => {
			const updateRes = update({
				_id: CREATED_DOCUMENT_TYPE_NODE._id,
				properties: []
			}, javaBridge);
			//javaBridge.log.info('updateRes:%s', updateRes);
			const expected = {
				...CREATED_DOCUMENT_TYPE_NODE,
				properties: []
			};
			deepStrictEqual(
				expected,
				updateRes
			);
			deepStrictEqual(
				expected,
				connection.get(CREATED_DOCUMENT_TYPE_NODE._id)
			);
		}); // it
	}); // describe update()
}); // describe documentType
