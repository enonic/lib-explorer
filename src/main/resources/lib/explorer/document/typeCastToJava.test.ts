import type { send } from '@enonic-types/lib-event';
import type { connect } from '@enonic-types/lib-node';


import {
	GeoPoint,
	Instant,
	LocalDate,
	LocalDateTime,
	LocalTime,
	LibEvent,
	LibNode,
	LibValue,
	Log,
	Reference,
	Server
} from '@enonic/mock-xp';
import {
	describe,
	// expect,
	jest,
	test as it
} from '@jest/globals';
import {
	fieldsArrayToObj,
	typeCastToJava
} from './index';



const server = new Server({
	loglevel: 'silent'
});

// eslint-disable-next-line @typescript-eslint/no-namespace
declare module globalThis {
	let log: Log
}

globalThis.log = server.log;

const libEvent = new LibEvent({
	server
});

const libNode = new LibNode({
	server
});

jest.mock('/lib/explorer/stemming/javaLocaleToSupportedLanguage', () => {
	return {
		javaLocaleToSupportedLanguage: jest.fn().mockImplementation((locale :string) => {
			if (locale === 'en-GB') {
				return 'en';
			}
			return 'en';
		})
	};
});

jest.mock('/lib/xp/event', () => {
	return {
		send: jest.fn<typeof send>((event) => libEvent.send(event)),
	}
}, { virtual: true });

jest.mock('/lib/xp/node', () => {
	return {
		connect: jest.fn<typeof connect>((params) => libNode.connect(params)),
	}
}, { virtual: true });

jest.mock('/lib/xp/value', () => LibValue, { virtual: true });


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


const FIELDS_OBJ = fieldsArrayToObj(FIELDS);


describe('document', () => {
	describe('typeCastToJava()', () => {

		it('handles some data', () => {
			expect(typeCastToJava({
				data: {
					any: 'any',
					boolean: true,
					double: -1.1,
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
			})).toEqual({
				any: 'any',
				boolean: true,
				double: -1.1,
				geoPointString: new GeoPoint({
					lat: 59.9090442,
					lon: 10.7423389
				}),
				instant: new Instant('9999-12-31T23:59:59.123456789Z'),
				localDate: new LocalDate('9999-12-31'),
				localDateTime: new LocalDateTime('9999-12-31T23:59:59.123456789'),
				localTime: new LocalTime('23:59:59.123456789'),
				long: -1,
				reference: new Reference('c51c80c2-66a1-442a-91e2-4f55b4256a72'),
				//set: {}, // TODO
				string: 'string',
				x: 'x' // Extra field which is not defined in documentType thus cannot be typeCasted
			})
		});

		it('handles some other data', () => {
			const date = new Date();
			expect(typeCastToJava({
				data: {
					//any: 'any',
					boolean: false,
					double: 1.1,
					geoPointString: '-90,-180',
					instant: date,
					localDate: date,
					localDateTime: date,
					localTime: date,
					long: 1//,
					//reference: 'c51c80c2-66a1-442a-91e2-4f55b4256a72',
					//set: {},
					//string: 'string',
					//x: 'x'
				},
				fieldsObj: FIELDS_OBJ
			})).toEqual({
				//any: 'any',
				boolean: false,
				double: 1.1,
				geoPointString: new GeoPoint({
					lat: -90,
					lon: -180
				}),
				instant: new Instant(date),
				localDate: new LocalDate(date),
				localDateTime: new LocalDateTime(date),
				localTime: new LocalTime(date),
				long: 1//,
				//reference: 'c51c80c2-66a1-442a-91e2-4f55b4256a72',
				//set: {},
				//string: 'string',
				//x: 'x'
			});
		});

		it(`[59.9090442,10.7423389]`, () => {
			expect(typeCastToJava({
				data: {
					geoPoint: [59.9090442,10.7423389]
				},
				fieldsObj: FIELDS_OBJ
			})).toEqual({
				geoPoint: new GeoPoint({
					lat: 59.9090442,
					lon: 10.7423389
				}),
			});
		}); // it

		it(`[-90,-180]`, () => {
			expect(typeCastToJava({
				data: {
					geoPoint: [-90,-180]
				},
				fieldsObj: FIELDS_OBJ
			})).toEqual({
				geoPoint: new GeoPoint({
					lat: -90,
					lon: -180,
				})
			});
		}); // it
	}); // describe typeCastToJava()
}); // describe document
