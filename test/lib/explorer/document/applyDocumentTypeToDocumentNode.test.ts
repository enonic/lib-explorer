import {
	DocumentNode,
	DocumentType
} from '/lib/explorer/types/';

import { deepStrictEqual } from 'assert';
import { applyDocumentTypeToDocumentNode } from '../../../../src/main/resources/lib/explorer/_uncoupled/document/applyDocumentTypeToDocumentNode';


describe('document', () => {
	describe('applyDocumentTypeToDocumentNode()', () => {
		it('applies forceArray when max !== 1', () => {
			deepStrictEqual(
				{
					list: ['singleValue']
				},
				applyDocumentTypeToDocumentNode({
					documentType: {
						properties: [{
							name: 'list',
							max: 0
						}]
					} as DocumentType,
					documentNode: {
						list: 'singleValue'
					} as unknown as DocumentNode
				})
			);
		}); // it
		it('Handles when value already array', () => {
			deepStrictEqual(
				{
					list: ['singleValue']
				},
				applyDocumentTypeToDocumentNode({
					documentType: {
						properties: [{
							name: 'list',
							max: 0
						}]
					} as DocumentType,
					documentNode: {
						list: ['singleValue']
					} as unknown as DocumentNode
				})
			);
		}); // it
		it('Handles multiple values', () => {
			deepStrictEqual(
				{
					list: ['oneOfTwo', 'twoOfTwo']
				},
				applyDocumentTypeToDocumentNode({
					documentType: {
						properties: [{
							name: 'list',
							max: 0
						}]
					} as DocumentType,
					documentNode: {
						list: ['oneOfTwo', 'twoOfTwo']
					} as unknown as DocumentNode
				})
			);
		}); // it
		it('Handles undefined value', () => {
			deepStrictEqual(
				{},
				applyDocumentTypeToDocumentNode({
					documentType: {
						properties: [{
							name: 'list',
							max: 0
						}]
					} as DocumentType,
					documentNode: {} as DocumentNode
				})
			);
		}); // it
	}); // describe applyDocumentTypeToDocumentNode
}); // describe document
