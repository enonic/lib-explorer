import type {RepoConnection as WriteConnection} from '/lib/xp/node';
import type {
	InterfaceField,
	InterfaceNode,
	InterfaceNodeCreateParams,
	TermQuery
} from '@enonic-types/lib-explorer';
import type { InterfaceExpressions } from '@enonic-types/lib-explorer/Interface';


import { INDEX_CONFIG_N_GRAM } from '@enonic/js-utils';
import { noNilsArray } from '@enonic/js-utils/array/noNilsArray';
import {
	INTERFACES_FOLDER,
	NT_INTERFACE,
	ROOT_PERMISSIONS_EXPLORER
} from '/lib/explorer/constants';
import {reference} from '/lib/xp/value';


interface InterfaceCreateParams {
	_name: string;
	collectionIds?: string[];
	expressions?: InterfaceExpressions;
	fields?: InterfaceField[];
	stopWords?: string[];
	synonymIds?: string[];
	termQueries?: TermQuery[];
};


export function create({
	_name,
	collectionIds,
	expressions,
	fields,
	stopWords,
	synonymIds,
	termQueries,
}: InterfaceCreateParams, {
	writeConnection
}: {
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
		_parentPath: `/${INTERFACES_FOLDER}`,
		_permissions: ROOT_PERMISSIONS_EXPLORER,
		collectionIds: noNilsArray(collectionIds).map((collectionId) => reference(collectionId)), // empty array allowed,
		fields: noNilsArray(fields).map(({ // empty array allowed
			boost, // undefined allowed
			name
		}) => ({
			boost,
			name
		})),
		expressions,
		stopWords: noNilsArray(stopWords),
		synonymIds: noNilsArray(synonymIds).map((synonymId) => reference(synonymId)), // empty array allowed
		termQueries: noNilsArray(termQueries), // empty array allowed
	}) as InterfaceNode;
	writeConnection.refresh(); // So the data becomes immidiately searchable
	return createdInterface;
}
