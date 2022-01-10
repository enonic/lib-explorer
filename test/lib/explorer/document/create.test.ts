import {
	deepStrictEqual,
	throws
} from 'assert';

import {
	document
} from '../../../../../rollup/index.js';


const {create} = document;


const log = { //console.log console.trace
	//debug: () => {/**/},
	debug: (...s :unknown[]) => console.debug('DEBUG', ...s),
	//error: () => {/**/},
	error: (...s :unknown[]) => console.error('ERROR', ...s),
	info: () => {/**/},
	//info: (...s :unknown[]) => console.info('INFO ', ...s),
	//warning: () => {/**/}
	warning: (...s :unknown[]) => console.warn('WARN ', ...s)
};


const COLLECTION_ID = '00000000-0000-4000-8000-000000000000';
const COLLECTION_NAME = 'myCollectionName';
const COLLECTION_LANGUAGE = 'en-GB';
const COLLECTION_STEMMING_LANGUAGE = 'en';

const COLLECTOR_ID = 'todo-collectorId';
const COLLECTOR_VERSION = 'todo-collectorVersion';

const DOCUMENT_TYPE_ID = '00000000-0000-4000-8000-000000000001';
const DOCUMENT_TYPE_NAME = 'myDocumentTypeName';
const DOCUMENT_TYPE_FIELDS = [{
	enabled: true,
	fulltext: false,
	includeInAllText: false,
	max: 0,
	min: 0,
	name: 'myString',
	nGram: false,
	path: false,
	valueType: 'string'
}];

const COLLECTION = {
	_id: COLLECTION_ID,
	_name: COLLECTION_NAME,
	documentTypeId: DOCUMENT_TYPE_ID,
	language: COLLECTION_LANGUAGE
};

const DOCUMENT_TYPE = {
	_id: DOCUMENT_TYPE_ID,
	_name: DOCUMENT_TYPE_NAME,
	properties: DOCUMENT_TYPE_FIELDS
};

const NODES = {
	[COLLECTION_ID]: COLLECTION,
	[DOCUMENT_TYPE_ID]:  DOCUMENT_TYPE
};

const CREATED_TIME = new Date();


describe('document', () => {
	describe('create()', () => {
		it(`throws on missing parameter object`, () => {
			throws(
				() => create(),
				{
					message: 'create: parameter object is missing!',
					name: 'Error'
				}
			);
		}); // it
		it(`throws on missing collectionId`, () => {
			throws(
				() => create({}),
				{
					message: "create: required parameter 'collectionId' is missing!",
					name: 'Error'
				}
			);
		}); // it
		it(`throws when collectionId is not an uuidv4 string`, () => {
			throws(
				() => create({
					collectionId: ''
				}),
				{
					message: "create: parameter 'collectionId' is not an uuidv4 string!",
					name: 'TypeError'
				}
			);
		}); // it
		it(`throws on missing collectorId`, () => {
			throws(
				() => create({
					collectionId: COLLECTION_ID
				}),
				{
					message: "create: required parameter 'collectorId' is missing!",
					name: 'Error'
				}
			);
		}); // it
		it(`throws when collectorId is not a string`, () => {
			throws(
				() => create({
					collectionId: COLLECTION_ID,
					collectorId: 0
				}),
				{
					message: "create: parameter 'collectorId' is not a string!",
					name: 'TypeError'
				}
			);
		}); // it
		it(`throws on missing collectorVersion`, () => {
			throws(
				() => create({
					collectionId: COLLECTION_ID,
					collectorId: COLLECTOR_ID
				}),
				{
					message: "create: required parameter 'collectorVersion' is missing!",
					name: 'Error'
				}
			);
		}); // it
		it(`throws when collectorVersion is not a string`, () => {
			throws(
				() => create({
					collectionId: COLLECTION_ID,
					collectorId: COLLECTOR_ID,
					collectorVersion: 0
				}),
				{
					message: "create: parameter 'collectorVersion' is not a string!",
					name: 'TypeError'
				}
			);
		}); // it
		it(`is able to get collectionName, documentTypeId, documentTypeName, language and stemmmingLanguage from collectionId`, () => {
			deepStrictEqual(
				{
					document_metadata: {
						collection: COLLECTION_NAME,
						collector: {
							id: COLLECTOR_ID,
							version: COLLECTOR_VERSION
						},
						createdTime: CREATED_TIME,
						documentType: DOCUMENT_TYPE_NAME,
						language: COLLECTION_LANGUAGE,
						stemmingLanguage: COLLECTION_STEMMING_LANGUAGE,
						valid: true
					},
					extra: 'extra',
					myString: 'string'
				},
				create({
					// Input
					collectionId: COLLECTION_ID,
					collectorId: COLLECTOR_ID,
					collectorVersion: COLLECTOR_VERSION,
					createdTime: CREATED_TIME,
					data: {
						myString: 'string',
						extra: 'extra'
					},
					// Options
					//addExtraFields, // default is !cleanExtraFields
					//cleanExtraFields: false, // default is false
					//cleanExtraFields: true,
					requireValid: true,
					validateOccurrences: true//, // default is false
					//validateTypes: true // default is same as requireValid
				}, {
					connect: (/*source*/) => ({
						get: (id :string) => {
							return NODES[id];
						}
					}),
					log
				})
			)
		}); // it
	}); // describe create
}); // describe document
