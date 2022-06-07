import type {
	InterfaceField,
	InterfaceNode,
	InterfaceNodeCreateParams,
	WriteConnection
} from '/lib/explorer/types/index.d';


import {
	INDEX_CONFIG_N_GRAM,
	forceArray,
	isNotSet
} from '@enonic/js-utils';
import {
	INTERFACES_FOLDER,
	NT_INTERFACE,
	ROOT_PERMISSIONS_EXPLORER
} from '/lib/explorer/constants';
//@ts-ignore
import {reference} from '/lib/xp/value';


export function create({
	_name,
	collectionIds,
	fields,
	stopWords,
	synonymIds
} :{
	_name :string
	collectionIds ?:Array<string>
	fields ?:Array<InterfaceField>
	stopWords ?:Array<string>
	synonymIds ?:Array<string>
}, {
	writeConnection
} :{
	writeConnection: WriteConnection
}) {
	const createdInterface = writeConnection.create<InterfaceNodeCreateParams>({
		_indexConfig: {
			default: {
				decideByType: true,
				enabled: true,
				[INDEX_CONFIG_N_GRAM]: false,
				fulltext: false,
				includeInAllText: false,
				path: false,
				indexValueProcessors: [],
				languages: []
			}
		},
		_inheritsPermissions: false, // false is the default and the fastest, since it doesn't have to read parent to apply permissions.
		_name,
		_nodeType: NT_INTERFACE,
		_parentPath :`/${INTERFACES_FOLDER}`,
		_permissions: ROOT_PERMISSIONS_EXPLORER,
		collectionIds: isNotSet(collectionIds) ? [] : forceArray(collectionIds).map((collectionId) => reference(collectionId)), // empty array allowed,
		fields: isNotSet(fields) ? [] : forceArray(fields).map(({ // empty array allowed
			boost, // undefined allowed
			name
		}) => ({
			boost,
			name
		})),
		stopWords: isNotSet(stopWords) ? [] : forceArray(stopWords),
		synonymIds: isNotSet(synonymIds) ? [] : forceArray(synonymIds).map((synonymId) => reference(synonymId)) // empty array allowed
	}) as InterfaceNode;
	writeConnection.refresh(); // So the data becomes immidiately searchable
	return createdInterface;
}
