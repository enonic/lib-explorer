import type {RepoConnection as WriteConnection} from '/lib/xp/node';
import type {
	InterfaceField,
	InterfaceNode,
} from '@enonic-types/lib-explorer';
import type { InterfaceExpressions, TermQuery } from '@enonic-types/lib-explorer/Interface.d';


import { noNilsArray } from '@enonic/js-utils/array/noNilsArray';
import {reference} from '/lib/xp/value';


interface InterfaceUpdateParams {
	_id: string;
	collectionIds: string[];
	expressions?: InterfaceExpressions;
	fields: InterfaceField[];
	stopWords: string[];
	synonymIds: string[];
	termQueries?: TermQuery[];
};


export function update({
	_id,
	collectionIds,
	expressions,
	fields,
	stopWords,
	synonymIds,
	termQueries,
} :InterfaceUpdateParams, {
	writeConnection
} :{
	writeConnection: WriteConnection
}) {
	const updatedInterface = writeConnection.modify<InterfaceNode>({
		key: _id,
		editor: (interfaceNode) => {
			interfaceNode.collectionIds = noNilsArray(collectionIds).map((collectionId) => reference(collectionId)); // empty array allowed,
			interfaceNode.expressions = expressions;
			interfaceNode.fields = noNilsArray(fields).map(({ // empty array allowed
				boost, // undefined allowed
				name
			}) => ({
				boost,
				name
			}));
			interfaceNode.stopWords = noNilsArray(stopWords);
			interfaceNode.synonymIds = noNilsArray(synonymIds).map((synonymId) => reference(synonymId)); // empty array allowed,
			interfaceNode.termQueries = noNilsArray(termQueries); // empty array allowed
			return interfaceNode;
		}
	});
	writeConnection.refresh(); // So the data becomes immidiately searchable
	return updatedInterface;
}
