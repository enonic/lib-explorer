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
	CREATED_DOCUMENT,
	DOCUMENT_TYPE_FIELDS,
	DOCUMENT_TYPE_NAME,
	INDEX_CONFIG
} from '../../../testData';
import {
	CONNECT_DUMMY,
	log
} from '../../../dummies';

const {update} = document;

const javaBridgeStub = {
	connect: CONNECT_DUMMY,
	log
};

describe('document', () => {
	describe('update()', () => {
		it(`throws on missing parameter object`, () => {
			throws(
				() => update(undefined, javaBridgeStub),
				{
					message: 'update: parameter object is missing!',
					name: 'Error'
				}
			);
		}); // it
		it(`throws if data is missing`, () => {
			throws(
				() => update({}, javaBridgeStub),
				{
					message: "update: missing required parameter data!",
					name: 'Error'
				}
			);
		}); // it
		it(`throws if data doesn't contain _id`, () => {
			throws(
				() => update({
					collectionName: COLLECTION_NAME,
					collectorId: COLLECTOR_ID,
					collectorVersion: COLLECTOR_VERSION,
					documentTypeName: DOCUMENT_TYPE_NAME,
					data: {},
					fields: DOCUMENT_TYPE_FIELDS//,
					//language: COLLECTION_LANGUAGE
				}, javaBridgeStub),
				{
					message: "update: parameter data: missing required property '_id'!",
					name: 'Error'
				}
			);
		}); // it
		it(`throws if data._id not uuidv4 string`, () => {
			throws(
				() => update({
					collectionName: COLLECTION_NAME,
					collectorId: COLLECTOR_ID,
					collectorVersion: COLLECTOR_VERSION,
					documentTypeName: DOCUMENT_TYPE_NAME,
					data: {
						_id: ''
					},
					fields: DOCUMENT_TYPE_FIELDS//,
					//language: COLLECTION_LANGUAGE
				}, javaBridgeStub),
				{
					message: "update: parameter data: property '_id' is not an uuidv4 string!",
					name: 'TypeError'
				}
			);
		}); // it
		it(`throws if both collectionName and collectionId are missing`, () => {
			throws(
				() => update({
					data: CREATED_DOCUMENT
				}, javaBridgeStub),
				{
					message: "update: either provide collectionName or collectionId!",
					name: 'Error'
				}
			);
		}); // it
		it(`throws if both documentTypeName, documentTypeId and collectionId are missing`, () => {
			throws(
				() => update({
					collectionName: COLLECTION_NAME,
					data: CREATED_DOCUMENT
				}, javaBridgeStub),
				{
					message: "update: either provide documentTypeName, documentTypeId or collectionId!",
					name: 'Error'
				}
			);
		}); // it
		it(`throws if both fields, documentTypeId and collectionId are missing`, () => {
			throws(
				() => update({
					collectionName: COLLECTION_NAME,
					documentTypeName: DOCUMENT_TYPE_NAME,
					data: CREATED_DOCUMENT
				}, javaBridgeStub),
				{
					message: "update: either provide fields, documentTypeId or collectionId!",
					name: 'Error'
				}
			);
		}); // it
		it(`throws on missing collectorId`, () => {
			throws(
				() => update({
					collectionId: COLLECTION_ID,
					data: CREATED_DOCUMENT
				}, javaBridgeStub),
				{
					message: "update: required parameter 'collectorId' is missing!",
					name: 'Error'
				}
			);
		}); // it
		it(`throws when collectorId is not a string`, () => {
			throws(
				() => update({
					collectionId: COLLECTION_ID,
					collectorId: 0,
					collectorVersion: COLLECTOR_VERSION,
					data: CREATED_DOCUMENT
				}, javaBridgeStub),
				{
					message: "update: parameter 'collectorId' is not a string!",
					name: 'TypeError'
				}
			);
		}); // it
		it(`throws on missing collectorVersion`, () => {
			throws(
				() => update({
					collectionId: COLLECTION_ID,
					collectorId: COLLECTOR_ID,
					data: CREATED_DOCUMENT
				}, javaBridgeStub),
				{
					message: "update: required parameter 'collectorVersion' is missing!",
					name: 'Error'
				}
			);
		}); // it
		it(`throws when collectorVersion is not a string`, () => {
			throws(
				() => update({
					collectionId: COLLECTION_ID,
					collectorId: COLLECTOR_ID,
					collectorVersion: 0,
					data: CREATED_DOCUMENT
				}, javaBridgeStub),
				{
					message: "update: parameter 'collectorVersion' is not a string!",
					name: 'TypeError'
				}
			);
		}); // it
		it(`throws when collectionId is not an uuidv4 string`, () => {
			throws(
				() => update({
					collectionId: '',
					collectorId: COLLECTOR_ID,
					collectorVersion: COLLECTOR_VERSION,
					data: CREATED_DOCUMENT
				}, javaBridgeStub),
				{
					message: "update: parameter 'collectionId' is not an uuidv4 string!",
					name: 'TypeError'
				}
			);
		}); // it
		it(`throws when collectionName is not a string`, () => {
			throws(
				() => update({
					collectionName: true, // !string
					collectorId: COLLECTOR_ID,
					collectorVersion: COLLECTOR_VERSION,
					data: CREATED_DOCUMENT,
					documentTypeName: DOCUMENT_TYPE_NAME,
					fields: DOCUMENT_TYPE_FIELDS
				}, javaBridgeStub),
				{
					message: "update: parameter 'collectionName' is not a string!",
					name: 'TypeError'
				}
			);
		}); // it
		it(`throws when documentTypeName is not a string`, () => {
			throws(
				() => update({
					collectionName: COLLECTION_NAME,
					collectorId: COLLECTOR_ID,
					collectorVersion: COLLECTOR_VERSION,
					data: CREATED_DOCUMENT,
					documentTypeName: true, // !string
					fields: DOCUMENT_TYPE_FIELDS
				}, javaBridgeStub),
				{
					message: "update: parameter 'documentTypeName' is not a string!",
					name: 'TypeError'
				}
			);
		}); // it
		it(`throws when documentTypeId is not a string`, () => {
			throws(
				() => update({
					collectionName: COLLECTION_NAME,
					collectorId: COLLECTOR_ID,
					collectorVersion: COLLECTOR_VERSION,
					data: CREATED_DOCUMENT,
					documentTypeId: true, // !string
					fields: DOCUMENT_TYPE_FIELDS
				}, javaBridgeStub),
				{
					message: "update: parameter 'documentTypeId' is not a string!",
					name: 'TypeError'
				}
			);
		}); // it
	}); // describe create
}); // describe document
