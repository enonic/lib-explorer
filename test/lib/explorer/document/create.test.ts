import type {LooseObject} from '../../../types';

import {
	deepStrictEqual,
	throws
} from 'assert';

import {
	document
} from '../../../../../rollup/index.js';
import {
	COLLECTION_ID,
	COLLECTION_LANGUAGE,
	COLLECTION_NAME,
	COLLECTION_STEMMING_LANGUAGE,
	COLLECTOR_ID,
	COLLECTOR_VERSION,
	CREATED_TIME,
	DOCUMENT_TYPE_FIELDS,
	DOCUMENT_TYPE_NAME,
	INDEX_CONFIG
} from '../../../testData';
import {
	CONNECT_DUMMY,
	log
} from '../../../dummies';

const {create} = document;


const javaBridgeStub = {
	connect: CONNECT_DUMMY,
	log
};


describe('document', () => {
	describe('create()', () => {
		it(`throws on missing parameter object`, () => {
			throws(
				() => create(undefined, javaBridgeStub),
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
				}, javaBridgeStub),
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
				}, javaBridgeStub),
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
				}, javaBridgeStub),
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
				}, javaBridgeStub),
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
				}, javaBridgeStub),
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
				}, javaBridgeStub),
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
				}, javaBridgeStub),
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
				}, javaBridgeStub)
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
				}, javaBridgeStub)
			)
		}); // it
	}); // describe create
}); // describe document
