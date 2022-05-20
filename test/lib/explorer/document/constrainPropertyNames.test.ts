import {JavaBridge} from '@enonic/mock-xp';
//import {ASCII_PUNCTUATION} from '@enonic/test-data';
import {deepStrictEqual} from 'assert';

import {
	FIELD_PATH_GLOBAL,
	FIELD_PATH_META,
	document
} from '../../../../build/rollup/index.js';
import {log} from '../../../dummies';
const {constrainPropertyNames} = document;


const javaBridge = new JavaBridge({
	app: {
		config: {},
		name: 'com.enonic.app.explorer',
		version: '0.0.1-SNAPSHOT'
	},
	log
});


describe('document', () => {
	describe('constrainPropertyNames()', () => {
		it('something', () => {
			const constrainedData = constrainPropertyNames({
				data: {
					'_id': '_id',
					[FIELD_PATH_GLOBAL]: FIELD_PATH_GLOBAL,
					[FIELD_PATH_META]: FIELD_PATH_META,
					'manycase#': 'NUMBER_SIGN',
					manyCase: 'camelCase',
					manycase: 'smallcase',
					MANYCASE: 'UPPERCASE',
					nEsTeD: {
						'!': 'nested.!',
						'_id': 'nested._id',
						'manycase#': 'nested.NUMBER_SIGN',
						MANYCASE: 'nested.UPPERCASE',
						manycase: 'nested.smallcase',
						manyCase: 'nested.camelCase',
					},
					'not.nested': 'not.nested'
				}
			}, javaBridge);
			//javaBridge.log.info('constrainedData:%s', constrainedData);
			deepStrictEqual({
				'_id': '_id',
				[FIELD_PATH_GLOBAL]: FIELD_PATH_GLOBAL,
				[FIELD_PATH_META]: FIELD_PATH_META,
				manycase: 'smallcase',
				nested: {
					id: 'nested._id',
					manycase: 'nested.smallcase'
				},
				not_nested: 'not.nested'
			}, constrainedData);
		}); // it
	}); // describe constrainPropertyNames
}); // describe document
