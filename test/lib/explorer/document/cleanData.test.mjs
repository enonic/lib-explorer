import {deepStrictEqual} from 'assert';

import {
	FIELD_PATH_GLOBAL,
	FIELD_PATH_META,
	document
} from '../../../../build/esbuild/esm/lib/explorer/index.mjs';

const {cleanData} = document;

/*const log = {
	warning: console.warn
};*/

describe('document', () => {
	describe('cleanData()', () => {
		it(`cleanData() removes ${FIELD_PATH_GLOBAL} and ${FIELD_PATH_META}`, () => {
			deepStrictEqual(
				{
					_id: '_id',
					_name: '_name',
					_path: '_path',
					_versionKey: '_versionKey',
					myString: 'myString',
					myObject: {
						myProperty: 'myObject.myProperty'
					}
				},
				cleanData({
					data: {
						_id: '_id',
						_name: '_name',
						_path: '_path',
						_versionKey: '_versionKey',
						[FIELD_PATH_GLOBAL]: `${FIELD_PATH_GLOBAL}`,
						[FIELD_PATH_META]: `${FIELD_PATH_META}`,
						myString: 'myString',
						myObject: {
							myProperty: 'myObject.myProperty'
						}
					}
				}/*, {
					log
				}*/)
			);
		});
	});
});
