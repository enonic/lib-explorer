import test from 'ava';
import {blackBright,red,yellow,white} from 'cli-color';
//import {print} from 'q-i';

import {checkAndApplyTypes} from '../src/main/resources/lib/explorer/document/checkAndApplyTypes.es';
import {ValidationError} from '../src/main/resources/lib/explorer/document/ValidationError.es';


var global = (1, eval)('this');
//global.global = global;
//global.globalThis = global;
//global.frames = global;
//global.self = global;
//global.window = global;
//module.exports = global;
global.log = {
	/* eslint-disable no-undef */
	debug: (a) => console.log(blackBright(`DEBUG ${a}`)),
	error: (a) => console.log(red(`ERROR ${a}`)),
	info: (a) => console.log(white(`INFO ${a}`)),
	warning: (a) => console.log(yellow(`WARN ${a}`))
	/* eslint-enable no-undef */
};


const FIELDS = {
	exactlyOneString: {
		valueType: 'string'
	},
	atLeastTwoBooleans: {
		valueType: 'boolean'
	}
};


test('Not a string:1 at path:exactlyOneString!', t => {
	const indexConfig = {
		default: 'byType',
		configs: [{
			path: 'document_metadata',
			config: 'minimal'
		}]
	};
	const nodeToCreate = {_name: 'name'};
	const error = t.throws(() => {
		checkAndApplyTypes({
			__boolRequireValid: true,
			boolValid: true,
			fields: FIELDS,
			indexConfig,
			nodeToCreate, // modified within function
			rest: {
				exactlyOneString: 1
			}
		});
	}, {instanceOf: ValidationError});
	t.is(error.message, 'Not a string:1 at path:exactlyOneString!');
});


test('Not a boolean:"one" at path:atLeastTwoBooleans!', t => {
	const indexConfig = {
		default: 'byType',
		configs: [{
			path: 'document_metadata',
			config: 'minimal'
		}]
	};
	const nodeToCreate = {_name: 'name'};
	const error = t.throws(() => {
		checkAndApplyTypes({
			__boolRequireValid: true,
			boolValid: true,
			fields: FIELDS,
			indexConfig,
			nodeToCreate, // modified within function
			rest: {
				exactlyOneString: 'one',
				atLeastTwoBooleans: ['one','two']
			}
		});
	}, {instanceOf: ValidationError});
	t.is(error.message, 'Not a boolean:"one" at path:atLeastTwoBooleans!');
});


test('Warn Not a boolean:"one" at path:atLeastTwoBooleans!', t => {
	const indexConfig = {
		default: 'byType',
		configs: [{
			path: 'document_metadata',
			config: 'minimal'
		}]
	};
	const createdTime = new Date();
	const nodeToCreate = {_name: 'name'};
	checkAndApplyTypes({
		__boolRequireValid: false,
		__createdTime: createdTime,
		boolValid: true,
		fields: FIELDS,
		indexConfig,
		nodeToCreate, // modified within function
		rest: {
			exactlyOneString: 'one',
			atLeastTwoBooleans: ['one','two']
		}
	});
	//print({nodeToCreate}, { maxItems: Infinity });
	t.deepEqual(nodeToCreate, {
		_name: 'name',
		exactlyOneString: 'one',
		atLeastTwoBooleans: [
			'one',
			'two'
		],
		_indexConfig: {
			default: 'byType',
			configs: [{
				path: 'document_metadata',
				config: 'minimal'
			}]
		},
		_inheritsPermissions: true,
		_nodeType: 'com.enonic.app.explorer:document',
		_parentPath: '/',
		_permissions: [],
		document_metadata: {
			createdTime,
			valid: false
		}
	});
});


test('No type errors, build correct nodeToCreate :)', t => {
	const indexConfig = {
		default: 'byType',
		configs: [{
			path: 'document_metadata',
			config: 'minimal'
		}]
	};
	const nodeToCreate = {_name: 'name'};
	const createdTime = new Date();
	checkAndApplyTypes({
		__boolRequireValid: true,
		__createdTime: createdTime,
		boolValid: true,
		fields: FIELDS,
		indexConfig,
		nodeToCreate, // modified within function
		rest: {
			exactlyOneString: 'one',
			atLeastTwoBooleans: [true,false]
		}
	});

	//console.debug('nodeToCreate', nodeToCreate);
	t.deepEqual(nodeToCreate, {
		_indexConfig: {
			default: 'byType',
			configs: [{
				path: 'document_metadata',
				config: 'minimal'
			}]
		},
		_inheritsPermissions: true,
		_name: 'name',
		_nodeType: 'com.enonic.app.explorer:document',
		_parentPath: '/',
		_permissions: [],
		document_metadata: {
			createdTime,
			valid: true
		},
		exactlyOneString: 'one',
		atLeastTwoBooleans: [true,false]
	});
});
