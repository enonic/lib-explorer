import {
	Log,
	Server
} from '@enonic/mock-xp';
//import {ASCII_PUNCTUATION} from '@enonic/test-data';
import {
    describe,
    expect,
    test as it
} from '@jest/globals';

import { FieldPath } from '@enonic/explorer-utils';
import { constrainPropertyNames } from './constrainPropertyNames';


// eslint-disable-next-line @typescript-eslint/no-namespace
declare module globalThis {
	let log: Log
}

const server = new Server({
	loglevel: 'silent'
});

globalThis.log = server.log;


describe('document', () => {
	describe('constrainPropertyNames()', () => {
		it('something', () => {
			const constrainedData = constrainPropertyNames({
				data: {
					'_id': '_id',
					[FieldPath.GLOBAL]: FieldPath.GLOBAL,
					[FieldPath.META]: FieldPath.META,
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
			});
			// log.info('constrainedData:%s', constrainedData);
			expect(constrainedData).toStrictEqual({
				'_id': '_id',
				[FieldPath.GLOBAL]: FieldPath.GLOBAL,
				[FieldPath.META]: FieldPath.META,
				manycase: 'smallcase',
				nested: {
					id: 'nested._id',
					manycase: 'nested.smallcase'
				},
				not_nested: 'not.nested'
			});
		}); // it
	}); // describe constrainPropertyNames
}); // describe document
