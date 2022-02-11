import {JavaBridge} from '@enonic/js-utils/src/mock/JavaBridge';
import {deepStrictEqual} from 'assert';

import {
	document
} from '../../../../build/rollup/index.js';
import {log} from '../../../dummies';

const {validate} = document;


const javaBridge = new JavaBridge({
	app: {
		config: {},
		name: 'com.enonic.app.explorer',
		version: '0.0.1-SNAPSHOT'
	},
	log
});

/*const FIELDS = [{
	active: true,
	enabled: true,
	fulltext: true,
	includeInAllText: false,
	max: 1,
	min: 1,
	name: 'uri',
	nGram: false,
	path: false,
	valueType: 'string'
}];*/


describe('document', () => {
	describe('validate()', () => {
		it('validate({data:{}, fieldsObj:{}}, validateOccurences: true) --> true', () => {
			deepStrictEqual(
				true,
				validate({
					data: {},
					fieldsObj: {},
					validateOccurrences: true
				}, javaBridge)
			);
		});
	}); // describe validate()
}); // describe document
