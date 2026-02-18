import type {RepoConnection as WriteConnection} from '/lib/xp/node';
import type {
	InterfaceField,
	InterfaceNode,
	TermQuery,
} from '../types.d';


import {
	forceArray,
	isNotSet
} from '@enonic/js-utils';
import {reference} from '/lib/xp/value';


export function update({
	_id,
	collectionIds,
	fields,
	stopWords,
	synonymIds,
	termQueries,
} :{
	_id: string
	collectionIds: string[]
	fields: InterfaceField[]
	stopWords: string[]
	synonymIds: string[]
	termQueries?: TermQuery[]
}, {
	writeConnection
} :{
	writeConnection: WriteConnection
}) {
	const updatedInterface = writeConnection.modify<InterfaceNode>({
		key: _id,
		editor: (interfaceNode) => {
			interfaceNode.collectionIds = isNotSet(collectionIds) ? [] : forceArray(collectionIds).map((collectionId) => reference(collectionId)); // empty array allowed,
			interfaceNode.fields = isNotSet(fields) ? [] : forceArray(fields).map(({ // empty array allowed
				boost, // undefined allowed
				name
			}) => ({
				boost,
				name
			}));
			interfaceNode.stopWords = isNotSet(stopWords) ? [] : forceArray(stopWords);
			interfaceNode.synonymIds = isNotSet(synonymIds) ? [] : forceArray(synonymIds).map((synonymId) => reference(synonymId)); // empty array allowed,
			interfaceNode.termQueries = isNotSet(termQueries) ? [] : forceArray(termQueries); // empty array allowed
			return interfaceNode;
		}
	});
	writeConnection.refresh(); // So the data becomes immidiately searchable
	return updatedInterface;
}
