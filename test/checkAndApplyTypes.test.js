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
	aString: {
		valueType: 'string'
	},
	twoBooleans: {
		valueType: 'boolean'
	},
	anInteger: {
		valueType: 'long'
	},
	aFloat: {
		valueType: 'double'
	},
	anobject: {
		valueType: 'set'
	},
	'anobject.nestedstring': {
		valueType: 'string'
	}
};


test('Not a string:1 at pathString:aString!', t => {
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
				aString: 1
			}
		});
	}, {instanceOf: ValidationError});
	t.is(error.message, 'Not a string:1 at pathString:aString!');
});


test('WARN Not a string:1 at pathString:aString!', t => {
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
			aString: 1
		}
	});
	//print({nodeToCreate}, { maxItems: Infinity });
	t.deepEqual(nodeToCreate, {
		_name: 'name',
		aString: 1,
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


test('Not a boolean:"one" at pathString:twoBooleans!', t => {
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
				aString: 'one',
				twoBooleans: ['one','two']
			}
		});
	}, {instanceOf: ValidationError});
	t.is(error.message, 'Not a boolean:"one" at pathString:twoBooleans!');
});


test('WARN Not a boolean:"one" at pathString:twoBooleans!', t => {
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
			aString: 'one',
			twoBooleans: ['one','two']
		}
	});
	//print({nodeToCreate}, { maxItems: Infinity });
	t.deepEqual(nodeToCreate, {
		_name: 'name',
		aString: 'one',
		twoBooleans: [
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


test('Not an integer:"one" at pathString:anInteger!', t => {
	const indexConfig = {
		default: 'byType',
		configs: [{
			path: 'document_metadata',
			config: 'minimal'
		}]
	};
	const nodeToCreate = {_name: 'name'};
	const createdTime = new Date();
	const error = t.throws(() => {
		checkAndApplyTypes({
			__boolRequireValid: true,
			__createdTime: createdTime,
			boolValid: true,
			fields: FIELDS,
			indexConfig,
			nodeToCreate, // modified within function
			rest: {
				anInteger: 'one'
			}
		});
	}, {instanceOf: ValidationError});
	t.is(error.message, 'Not an integer:"one" at pathString:anInteger!');
});


test('WARN Not an integer:"one" at pathString:anInteger!', t => {
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
			anInteger: 'one'
		}
	});
	//print({nodeToCreate}, { maxItems: Infinity });
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
			valid: false
		},
		anInteger: 'one'
	});
});


test('Not a number:"one" at pathString:aFloat!', t => {
	const indexConfig = {
		default: 'byType',
		configs: [{
			path: 'document_metadata',
			config: 'minimal'
		}]
	};
	const nodeToCreate = {_name: 'name'};
	const createdTime = new Date();
	const error = t.throws(() => {
		checkAndApplyTypes({
			__boolRequireValid: true,
			__createdTime: createdTime,
			boolValid: true,
			fields: FIELDS,
			indexConfig,
			nodeToCreate, // modified within function
			rest: {
				aFloat: 'one'
			}
		});
	}, {instanceOf: ValidationError});
	t.is(error.message, 'Not a number:"one" at pathString:aFloat!');
});


test('WARN Not a number:"one" at pathString:aFloat!', t => {
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
		__boolRequireValid: false,
		__createdTime: createdTime,
		boolValid: true,
		fields: FIELDS,
		indexConfig,
		nodeToCreate, // modified within function
		rest: {
			aFloat: 'one'
		}
	});
	//print({nodeToCreate}, { maxItems: Infinity });
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
			valid: false
		},
		aFloat: 'one'
	});
});


test('Not a set:"one" at pathString:anobject!', t => {
	const indexConfig = {
		default: 'byType',
		configs: [{
			path: 'document_metadata',
			config: 'minimal'
		}]
	};
	const nodeToCreate = {_name: 'name'};
	const createdTime = new Date();
	const error = t.throws(() => {
		checkAndApplyTypes({
			__boolRequireValid: true,
			__createdTime: createdTime,
			boolValid: true,
			fields: FIELDS,
			indexConfig,
			nodeToCreate, // modified within function
			rest: {
				anobject: 'one'
			}
		});
	}, {instanceOf: ValidationError});
	t.is(error.message, 'Not a set:"one" at pathString:anobject!');
});


test('WARN Not a set:"one" at pathString:anobject!', t => {
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
		__boolRequireValid: false,
		__createdTime: createdTime,
		boolValid: true,
		fields: FIELDS,
		indexConfig,
		nodeToCreate, // modified within function
		rest: {
			anobject: 'one'
		}
	});
	//print({nodeToCreate}, { maxItems: Infinity });
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
			valid: false
		},
		anobject: 'one'
	});
});


test('Not a string:true at pathString:anobject.nestedstring!', t => {
	const indexConfig = {
		default: 'byType',
		configs: [{
			path: 'document_metadata',
			config: 'minimal'
		}]
	};
	const nodeToCreate = {_name: 'name'};
	const createdTime = new Date();
	const error = t.throws(() => {
		checkAndApplyTypes({
			__boolRequireValid: true,
			__createdTime: createdTime,
			boolValid: true,
			fields: FIELDS,
			indexConfig,
			nodeToCreate, // modified within function
			rest: {
				anobject: {
					nestedstring: true
				}
			}
		});
	}, {instanceOf: ValidationError});
	t.is(error.message, 'Not a string:true at pathString:anobject.nestedstring!');
});


test('WARN Not a string:true at pathString:anobject.nestedstring!', t => {
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
		__boolRequireValid: false,
		__createdTime: createdTime,
		boolValid: true,
		fields: FIELDS,
		indexConfig,
		nodeToCreate, // modified within function
		rest: {
			anobject: {
				nestedstring: true
			}
		}
	});
	//print({nodeToCreate}, { maxItems: Infinity });
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
			valid: false
		},
		anobject: {
			nestedstring: true
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
			aString: 'one',
			twoBooleans: [true,false],
			anInteger: -1,
			aFloat: -1.1,
			anobject: {
				nestedstring: 'string'
			}
		}
	});

	//print({nodeToCreate}, { maxItems: Infinity });
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
		aString: 'one',
		twoBooleans: [true,false],
		anInteger: -1,
		aFloat: -1.1,
		anobject: {
			nestedstring: 'string'
		}
	});
});
