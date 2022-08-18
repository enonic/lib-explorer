import {deepStrictEqual} from 'assert';
import {
	document
} from '../../../../build/rollup/index.js';
//import {applyDocumentTy	peToDocumentNode} from '../../../../src/main/resources/lib/explorer/document/applyDocumentTypeToDocumentNode';


describe('document', () => {
	describe('applyDocumentTypeToDocumentNode()', () => {
		it('applies forceArray when max !== 1', () => {
			deepStrictEqual(
				{
					list: ['singleValue']
				},
				document.applyDocumentTypeToDocumentNode({
					documentType: {
						properties: [{
							name: 'list',
							max: 0
						}]
					},
					documentNode: {
						list: 'singleValue'
					}
				})
			);
		}); // it
		it('Handles when value already array', () => {
			deepStrictEqual(
				{
					list: ['singleValue']
				},
				document.applyDocumentTypeToDocumentNode({
					documentType: {
						properties: [{
							name: 'list',
							max: 0
						}]
					},
					documentNode: {
						list: ['singleValue']
					}
				})
			);
		}); // it
		it('Handles multiple values', () => {
			deepStrictEqual(
				{
					list: ['oneOfTwo', 'twoOfTwo']
				},
				document.applyDocumentTypeToDocumentNode({
					documentType: {
						properties: [{
							name: 'list',
							max: 0
						}]
					},
					documentNode: {
						list: ['oneOfTwo', 'twoOfTwo']
					}
				})
			);
		}); // it
		it('Handles undefined value', () => {
			deepStrictEqual(
				{},
				document.applyDocumentTypeToDocumentNode({
					documentType: {
						properties: [{
							name: 'list',
							max: 0
						}]
					},
					documentNode: {}
				})
			);
		}); // it
	}); // describe applyDocumentTypeToDocumentNode
}); // describe document
