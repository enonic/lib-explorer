import {JavaBridge} from '@enonic/js-utils/src/mock/JavaBridge';
import {deepStrictEqual} from 'assert';

import {
	document
} from '../../../../build/rollup/index.js';
import {log} from '../../../dummies';

const {
	fieldsArrayToObj,
	typeCastToJava
} = document;


const javaBridge = new JavaBridge({
	app: {
		config: {},
		name: 'com.enonic.app.explorer',
		version: '0.0.1-SNAPSHOT'
	},
	log
});


const VALUE_TYPE_ANY = 'any';
const VALUE_TYPE_BOOLEAN = 'boolean';
const VALUE_TYPE_DOUBLE = 'double';
const VALUE_TYPE_GEO_POINT = 'geoPoint';
const VALUE_TYPE_LONG = 'long';
const VALUE_TYPE_SET = 'set';
const VALUE_TYPE_INSTANT = 'instant';
const VALUE_TYPE_LOCAL_DATE = 'localDate';
const VALUE_TYPE_LOCAL_DATE_TIME = 'localDateTime';
const VALUE_TYPE_LOCAL_TIME = 'localTime';
const VALUE_TYPE_REFERENCE = 'reference';
const VALUE_TYPE_STRING = 'string';


const FIELDS = [{
	name: 'any',
	valueType: VALUE_TYPE_ANY
},{
	name: 'boolean',
	valueType: VALUE_TYPE_BOOLEAN
},{
	name: 'double',
	valueType: VALUE_TYPE_DOUBLE
},{
	name: 'geoPoint',
	valueType: VALUE_TYPE_GEO_POINT
},{
	name: 'geoPointString',
	valueType: VALUE_TYPE_GEO_POINT
},{
	name: 'instant',
	valueType: VALUE_TYPE_INSTANT
},{
	name: 'localDate',
	valueType: VALUE_TYPE_LOCAL_DATE
},{
	name: 'localDateTime',
	valueType: VALUE_TYPE_LOCAL_DATE_TIME
},{
	name: 'localTime',
	valueType: VALUE_TYPE_LOCAL_TIME
},{
	name: 'long',
	valueType: VALUE_TYPE_LONG
},{
	name: 'reference',
	valueType: VALUE_TYPE_REFERENCE
},{
	name: 'set',
	valueType: VALUE_TYPE_SET
},{
	name: 'string',
	valueType: VALUE_TYPE_STRING
}];


const FIELDS_OBJ = fieldsArrayToObj(FIELDS, javaBridge);

const TESTS = [{
	data: {
		any: 'any',
		boolean: true,
		double: -1.1,
		geoPoint: [59.9090442,10.7423389],
		geoPointString: '59.9090442,10.7423389',
		instant: '9999-12-31T23:59:59.123456789Z',
		localDate: '9999-12-31',
		localDateTime: '9999-12-31T23:59:59.123456789',
		localTime: '23:59:59.123456789',
		long: -1,
		reference: 'c51c80c2-66a1-442a-91e2-4f55b4256a72',
		//set: {}, // TODO
		string: 'string',
		x: 'x' // Extra field which is not defined in documentType thus cannot be typeCasted
	},
	fieldsObj: FIELDS_OBJ
},{
	data: {
		//any: 'any',
		boolean: false,
		double: 1.1,
		geoPoint: [-90,-180],
		geoPointString: '-90,-180',
		instant: new Date(),
		localDate: new Date(),
		localDateTime: new Date(),
		localTime: new Date(),
		long: 1//,
		//reference: 'c51c80c2-66a1-442a-91e2-4f55b4256a72',
		//set: {},
		//string: 'string',
		//x: 'x'
	},
	fieldsObj: FIELDS_OBJ
}];


function toStr(v :unknown) { return JSON.stringify(v); }


describe('document', () => {
	describe('typeCastToJava()', () => {
		for (var i = 0; i < TESTS.length; i++) {
			const params = TESTS[i];
			it(`${toStr(params)}`, () => {
				deepStrictEqual(
					params.data,
					typeCastToJava(params, javaBridge)
				);
			});
		} // for
	});
});
