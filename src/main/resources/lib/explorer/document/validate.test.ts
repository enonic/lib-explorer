import {Log, Server} from '@enonic/mock-xp';
import {deepStrictEqual} from 'assert';

import { validate } from './validate';


const server = new Server({
	loglevel: 'silent'
});

// eslint-disable-next-line @typescript-eslint/no-namespace
declare module globalThis {
	let log: Log
}

globalThis.log = server.log;

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
				})
			);
		});
	}); // describe validate()
}); // describe document
