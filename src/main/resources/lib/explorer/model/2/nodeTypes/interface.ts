import type {
	ParentPath,
	Path
} from '/lib/explorer/types.d';
//import type {IndexConfig} from '/lib/explorer/types/IndexConfig.d';


import {
	INDEX_CONFIG_N_GRAM,
	forceArray
} from '@enonic/js-utils';
import {
	INTERFACES_FOLDER,
	NT_INTERFACE
} from '/lib/explorer/model/2/constants';
import {node} from '/lib/explorer/model/2/nodeTypes/node';

//@ts-ignore
import {reference} from '/lib/xp/value';


export function interfaceModel({
	/* eslint-disable no-unused-vars */
	_id, // avoid from ...rest
	_path, // avoid from ...rest
	_permissions, // avoid from ...rest
	_nodeType, // avoid from ...rest
	_versionKey, // avoid from ...rest
	/* eslint-enable no-unused-vars */

	_name,
	// NOTE: _parentPath is a parameter when creating a node, used in _path
	// Since it is not stored it creates diffing issues...
	_parentPath = `/${INTERFACES_FOLDER}`,

	collectionIds = [],
	//stopWordIds = [],
	synonymIds = [],
	...rest // _name fields stopWords synonyms
} :{
	_name :string

	_id? :string
	_parentPath? :ParentPath
	_path? :Path
	_permissions? :Array<string>
	_nodeType? :string
	_versionKey? :string

	collectionIds? :string | Array<string>
	synonymIds? :string | Array<string>
}) {
	return node({
		...rest,
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
		_name,
		_nodeType: NT_INTERFACE,
		_parentPath,
		collectionIds: forceArray(collectionIds).map((collectionId) => reference(collectionId)), // empty array allowed,
		//stopWordIds: forceArray(stopWordIds).map((stopWordId) => reference(stopWordId)), // empty array allowed,
		synonymIds: forceArray(synonymIds).map((synonymId) => reference(synonymId)) // empty array allowed,
	} /*as {
		_name :string
		_indexConfig :IndexConfig
		_nodeType :string
		_parentPath :ParentPath
		collectionIds :Array<string>
		synonymIds :Array<string>
	}*/);
} // interfaceModel
