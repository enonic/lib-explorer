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
	error: () => {/**/},
	//error: (...s :unknown[]) => console.error('ERROR', ...s),
	info: () => {/**/},
	//info: (...s :unknown[]) => console.info('INFO ', ...s),
	warning: () => {/**/}
	//warning: (...s :unknown[]) => console.warn('WARN ', ...s)
};


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
					collectionId: '00000000-0000-4000-8000-000000000000'
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
					collectionId: '00000000-0000-4000-8000-000000000000',
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
					collectionId: '00000000-0000-4000-8000-000000000000',
					collectorId: 'todo-collectorId'
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
					collectionId: '00000000-0000-4000-8000-000000000000',
					collectorId: 'todo-collectorId',
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
						collection: 'myCollectionName',
						collector: {
							id: 'todo-collectorId',
							version: 'todo-collectorVersion'
						},
						//createdTime TODO
						documentType: 'myDocumentTypeName',
						language: 'en-GB',
						stemmingLanguage: 'en'
						//valid TODO
					}
				},
				create({
					collectionId: '00000000-0000-4000-8000-000000000000',
					collectorId: 'todo-collectorId',
					collectorVersion: 'todo-collectorVersion'
				}, {
					connect: (/*source*/) => ({
						get: (id :string) => {
							if(id === '00000000-0000-4000-8000-000000000000') {
								return {
									_id: '00000000-0000-4000-8000-000000000000',
									_name: 'myCollectionName',
									documentTypeId: '00000000-0000-4000-8000-000000000001',
									language: 'en-GB'
								}
							}
							if(id === '00000000-0000-4000-8000-000000000001') {
								return {
									_id: '00000000-0000-4000-8000-000000000001',
									_name: 'myDocumentTypeName'
								}
							}
						}
					}),
					log
				})
			)
		}); // it
	}); // describe create
}); // describe document
