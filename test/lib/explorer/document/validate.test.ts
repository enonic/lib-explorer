import type { JavaBridge as JavaBridgeWithStemmingLanguageFromLocale } from '../../../../src/main/resources/lib/explorer/_coupling/types';

import {JavaBridge} from '@enonic/mock-xp';
import {deepStrictEqual} from 'assert';

import { validate } from '../../../../src/main/resources/lib/explorer/_uncoupled/document/validate';
import {log} from '../../../dummies';


const javaBridge = new JavaBridge({
	app: {
		config: {},
		name: 'com.enonic.app.explorer',
		version: '0.0.1-SNAPSHOT'
	},
	log
}) as unknown as JavaBridgeWithStemmingLanguageFromLocale;

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
