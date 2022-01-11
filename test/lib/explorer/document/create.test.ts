import {
	deepStrictEqual,
	throws
} from 'assert';

import {
	document
} from '../../../../../rollup/index.js';
import {log} from '../../../dummies';

const {create} = document;


export interface LooseObject {
	[key :string] :unknown
}


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
	fulltext: true,
	includeInAllText: true,
	max: 0,
	min: 0,
	name: 'myString',
	nGram: true,
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


const INDEX_CONFIG = {
	configs: [{
		path: 'document_metadata.collection',
		config: {
			decideByType: false,
			enabled: true,
			fulltext: true,
			includeInAllText: false,
			nGram: true,
			path: false
		}
	},{
		path: 'document_metadata.collector.id',
		config: {
			decideByType: false,
			enabled: true,
			fulltext: false,
			includeInAllText: false,
			nGram: false,
			path: false
		}
	},{
		path: 'document_metadata.collector.version',
		config: {
			decideByType: false,
			enabled: true,
			fulltext: false,
			includeInAllText: false,
			nGram: false,
			path: false
		}
	},{
		path: 'document_metadata.createdTime',
		config: {
			decideByType: true,
			enabled: true,
			fulltext: false,
			includeInAllText: false,
			nGram: false,
			path: false
		}
	},{
		path: 'document_metadata.documentType',
		config: {
			decideByType: false,
			enabled: true,
			fulltext: true,
			includeInAllText: false,
			nGram: true,
			path: false
		}
	},{
		path: 'document_metadata.language',
		config: {
			decideByType: false,
			enabled: true,
			fulltext: true,
			includeInAllText: false,
			nGram: true,
			path: false
		}
	},{
		path: 'document_metadata.stemmingLanguage',
		config: {
			decideByType: false,
			enabled: true,
			fulltext: true,
			includeInAllText: false,
			nGram: true,
			path: false
		}
	},{
		path: 'document_metadata.valid',
		config: {
			decideByType: true,
			enabled: true,
			fulltext: false,
			includeInAllText: false,
			nGram: false,
			path: false
		}
	}],
	default: {
		decideByType: true,
		enabled: true,
		fulltext: false,
		includeInAllText: false,
		indexValueProcessors: [],
		languages: [COLLECTION_STEMMING_LANGUAGE],
		nGram: false,
		path: false
	}
};

const CONNECT_DUMMY = (/*source*/) => ({
	create: (data :LooseObject) => data,
	get: (id :string) => {
		return NODES[id];
	}
});

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
		it(`throws if both collectionName and collectionId are missing`, () => {
			throws(
				() => create({
					documentTypeName: DOCUMENT_TYPE_NAME
				}),
				{
					message: "create: either provide collectionName or collectionId!",
					name: 'Error'
				}
			);
		}); // it
		it(`throws if both documentTypeName, documentTypeId and collectionId are missing`, () => {
			throws(
				() => create({
					collectionName: COLLECTION_NAME
				}),
				{
					message: "create: either provide documentTypeName, documentTypeId or collectionId!",
					name: 'Error'
				}
			);
		}); // it
		it(`throws when collectionId is not an uuidv4 string`, () => {
			throws(
				() => create({
					collectionId: '',
					collectorId: COLLECTOR_ID,
					collectorVersion: COLLECTOR_VERSION
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
					collectorId: 0,
					collectorVersion: COLLECTOR_VERSION
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
			const _indexConfig = JSON.parse(JSON.stringify(INDEX_CONFIG));
			_indexConfig.configs.push({
					path: 'extra',
					config: {
						decideByType: false,
						enabled: true,
						fulltext: false,
						includeInAllText: false,
						languages: [COLLECTION_STEMMING_LANGUAGE],
						nGram: false,
						path: false
					}
				});
			_indexConfig.configs.push({
					path: 'myString',
					config: {
						decideByType: false,
						enabled: true,
						fulltext: true,
						includeInAllText: true,
						languages: [COLLECTION_STEMMING_LANGUAGE],
						nGram: true,
						path: false
					}
				});
			deepStrictEqual(
				{
					_indexConfig,
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
					connect: CONNECT_DUMMY,
					log
				})
			)
		}); // it
		it("is able to do it's thing without connection to the explorer repo if enough info is provided in the parameters", () => {
			const _indexConfig = JSON.parse(JSON.stringify(INDEX_CONFIG));
			_indexConfig.configs.push({
					path: 'myString',
					config: {
						decideByType: false,
						enabled: true,
						fulltext: true,
						includeInAllText: true,
						languages: [COLLECTION_STEMMING_LANGUAGE],
						nGram: true,
						path: false
					}
				});
			deepStrictEqual(
				{
					_indexConfig,
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
					myString: 'string'
				},
				create({
					collectionName: COLLECTION_NAME,
					collectorId: COLLECTOR_ID,
					collectorVersion: COLLECTOR_VERSION,
					createdTime: CREATED_TIME,
					data: {
						document_metadata: {
							shouldBeStripped: 'shouldBeStripped'
						},
						global: {
							shouldBeStripped: 'shouldBeStripped'
						},
						myString: 'string',
						extra: 'extra'
					},
					documentTypeName: DOCUMENT_TYPE_NAME,
					fields: DOCUMENT_TYPE_FIELDS,
					language: COLLECTION_LANGUAGE,
					// Options
					cleanExtraFields: true, // default is false
				},{
					connect: CONNECT_DUMMY,
					log
				})
			)
		}); // it
	}); // describe create
}); // describe document
