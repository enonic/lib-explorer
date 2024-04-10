import type {FieldNode} from '@enonic-types/lib-explorer';


import {
	VALUE_TYPE_STRING,
	isNotSet//,
	//toStr
} from '@enonic/js-utils';

import {PRINCIPAL_EXPLORER_WRITE} from '/lib/explorer/model/2/constants';
//import {field} from '/lib/explorer/model/2/nodeTypes/field';
import {modify} from '/lib/explorer/node/modify';
import {connect} from '/lib/explorer/repo/connect';


export function updateField({
	_id, // Required

	// Optional
	decideByType,
	enabled,
	//description,
	fieldType, // TODO valueType
	fulltext,
	includeInAllText,
	max,
	min,
	nGram, // INDEX_CONFIG_N_GRAM
	path
} :{
	_id :string

	decideByType? :boolean
	//description? :string
	enabled? :boolean
	fieldType? :string
	fulltext? :boolean
	includeInAllText? :boolean
	max? :string | number
	min? :string | number
	nGram? :boolean
	path? :boolean
}) :FieldNode {

	// Handle null values
	if (isNotSet(decideByType)) { decideByType = true; }
	if (isNotSet(enabled)) { enabled = true; }
	//if (isNotSet(description)) { description = ''; }
	if (isNotSet(fieldType)) { fieldType = VALUE_TYPE_STRING; }
	if (isNotSet(fulltext)) { fulltext = true; }
	if (isNotSet(includeInAllText)) { includeInAllText = true; }
	if (isNotSet(max)) { max = 0; }
	if (isNotSet(min)) { min = 0; }
	if (isNotSet(nGram)) { nGram = true; } // INDEX_CONFIG_N_GRAM
	if (isNotSet(path)) { path = false; }

	//const lcKey = key.toLowerCase();
	const propertiesToUpdate = {
		_id,
		//description,
		fieldType,
		max: parseInt(max as string, 10),
		min: parseInt(min as string, 10),
		indexConfig: {
			decideByType,
			enabled,
			nGram, // INDEX_CONFIG_N_GRAM
			fulltext,
			includeInAllText,
			path
		}
	};
	//log.debug(`propertiesToUpdate:${toStr(propertiesToUpdate)}`);

	const updatedNode = modify(propertiesToUpdate, {
		connection: connect({principals: [PRINCIPAL_EXPLORER_WRITE]})
	}) as FieldNode;
	//log.debug(`updatedNode:${toStr(updatedNode)}`);

	if(!updatedNode) {
		throw new Error(`Something went wrong when trying to update field with _id:${_id}.`);
	}
	return updatedNode;
} // updateField
