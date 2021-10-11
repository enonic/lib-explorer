import {forceArray} from '@enonic/js-utils';
import {
	INTERFACES_FOLDER,
	NT_INTERFACE
} from '/lib/explorer/model/2/constants';
import {node} from '/lib/explorer/model/2/nodeTypes/node';
import {reference} from '/lib/xp/value';


export function interfaceModel({
	/* eslint-disable no-unused-vars */
	_id, // avoid from ...rest
	_path, // avoid from ...rest
	_permissions, // avoid from ...rest
	_nodeType, // avoid from ...rest
	_versionKey, // avoid from ...rest
	/* eslint-enable no-unused-vars */

	// NOTE: _parentPath is a parameter when creating a node, used in _path
	// Since it is not stored it creates diffing issues...
	_parentPath = `/${INTERFACES_FOLDER}`,

	collectionIds = [],
	//stopWordIds = [],
	synonymIds = [],
	...rest // _name fields stopWords synonyms
}) {
	return node({
		...rest,
		_indexConfig: {
			default: {
				decideByType: true,
				enabled: true,
				nGram: false,
				fulltext: false,
				includeInAllText: false,
				path: false,
				indexValueProcessors: [],
				languages: []
			}
		},
		_nodeType: NT_INTERFACE,
		_parentPath,
		collectionIds: forceArray(collectionIds).map((collectionId) => reference(collectionId)), // empty array allowed,
		//stopWordIds: forceArray(stopWordIds).map((stopWordId) => reference(stopWordId)), // empty array allowed,
		synonymIds: forceArray(synonymIds).map((synonymId) => reference(synonymId)) // empty array allowed,
	});
} // interfaceModel
