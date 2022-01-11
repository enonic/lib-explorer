import {deepStrictEqual} from 'assert';

import {
	document
} from '../../../../../rollup/index.js';
import {log} from '../../../dummies';

const {validate} = document;


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
					validateOccurences: true
				}, {log})
			);
		});
	}); // describe validate()
}); // describe document
