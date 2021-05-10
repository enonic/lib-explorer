import test from 'ava';
import {checkOccurrencesAndBuildIndexConfig} from '../src/main/resources/lib/explorer/document/checkOccurrencesAndBuildIndexConfig.es';
import {ValidationError} from '../src/main/resources/lib/explorer/document/ValidationError.es';


const FIELDS = {
	exactlyOne: {
		indexConfig: 'byType',
		min: 1,
		max: 1,
		valueType: 'string'
	},
	atLeastTwo: {
		indexConfig: 'minimal',
		min: 2,
		valueType: 'boolean'
	}/*,
	noMinNoMax: {},
	optional: {
		min: 0,
		max: 0
	}*/
};


test('Missing required value at path:exactlyOne!', t => {
	const indexConfig = {
		default: 'byType',
		configs: [{
			path: 'document_metadata',
			config: 'minimal'
		}]
	};
	const error = t.throws(() => {
		checkOccurrencesAndBuildIndexConfig({
			fields: FIELDS,
			indexConfig, // modified inside function
			rest: {
				atLeastTwo: [1,2]
			}
		});
	}, {instanceOf: ValidationError});
	t.is(error.message, 'Missing a required value at path:exactlyOne!');
});


test('Expected at least 2 values at path:atLeastTwo!', t => {
	const indexConfig = {
		default: 'byType',
		configs: [{
			path: 'document_metadata',
			config: 'minimal'
		}]
	};
	const error = t.throws(() => {
		checkOccurrencesAndBuildIndexConfig({
			fields: FIELDS,
			indexConfig, // modified inside function
			rest: {
				exactlyOne: 'one',
				atLeastTwo: 1
			}
		});
	}, {instanceOf: ValidationError});
	t.is(error.message, 'Expected at least 2 values at path:atLeastTwo!');
});


test('Value occurrences:2 exceeds max:1 at path:exactlyOne!', t => {
	const indexConfig = {
		default: 'byType',
		configs: [{
			path: 'document_metadata',
			config: 'minimal'
		}]
	};
	const error = t.throws(() => {
		checkOccurrencesAndBuildIndexConfig({
			fields: FIELDS,
			indexConfig, // modified inside function
			rest: {
				exactlyOne: ['one', 'two'],
				atLeastTwo: [1,2]
			}
		});
	}, {instanceOf: ValidationError});
	t.is(error.message, 'Value occurrences:2 exceeds max:1 at path:exactlyOne!');
});


test('No occurrence errors build correct indexConfig :)', t => {
	const indexConfig = {
		default: 'byType',
		configs: [{
			path: 'document_metadata',
			config: 'minimal'
		}]
	};
	checkOccurrencesAndBuildIndexConfig({
		fields: FIELDS,
		indexConfig, // modified inside function
		rest: {
			exactlyOne: 1,
			atLeastTwo: [1,2]
		}
	});
	//console.debug('indexConfig', indexConfig);
	t.deepEqual(
		indexConfig,
		{
			default: 'byType',
			configs: [{
				path: 'document_metadata',
				config: 'minimal'
			},{
				path: 'exactlyOne',
				config: 'byType'
			},{
				path: 'atLeastTwo',
				config: 'minimal'
			}]
		}
	);
});
