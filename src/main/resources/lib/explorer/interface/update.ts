import type {
	InterfaceField,
	InterfaceNode,
	WriteConnection
} from '/lib/explorer/types/index.d';


import {
	forceArray,
	isNotSet
} from '@enonic/js-utils';
//@ts-ignore
import {reference} from '/lib/xp/value';


export function update({
	_id,
	collectionIds,
	fields,
	stopWords,
	synonymIds
} :{
	_id :string
	collectionIds :Array<string>
	fields :Array<InterfaceField>
	stopWords :Array<string>
	synonymIds :Array<string>
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
			return interfaceNode;
		}
	});
	writeConnection.refresh(); // So the data becomes immidiately searchable
	return updatedInterface;
}
