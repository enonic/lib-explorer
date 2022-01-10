import {deepStrictEqual} from 'assert';

import {
	document
} from '../../../../../rollup/index.js';

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


/*const log = { //console.log console.trace
	debug: console.debug,
	error: console.error,
	info: console.info,
	warning: console.warn
};*/


describe('document', () => {
	describe('validate()', () => {
		it('validate({data:{}, fieldsObj:{}}, validateOccurences: true) --> true', () => {
			deepStrictEqual(
				true,
				validate({
					data: {},
					fieldsObj: {},
					validateOccurences: true
				}/*, {log}*/)
			);
		});
	}); // describe validate()
}); // describe document
