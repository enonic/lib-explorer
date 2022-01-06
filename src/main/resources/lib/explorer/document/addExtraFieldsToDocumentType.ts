import {
	toStr
} from '@enonic/js-utils/dist/esm/index.mjs';
import traverse from 'traverse';

import type {
	Field,
	Fields
} from './Field';

import {
	applyDefaultsToField,
	fieldsArrayToObj,
	isFields
} from './Field';
import {logDummy} from './dummies';

interface LooseObject {
	[key :string] :unknown
}

interface AddExtraFieldsToDocumentTypeParams {
	data :LooseObject
	fields :Fields
}

export function addExtraFieldsToDocumentType({
	data,
	fields
} :AddExtraFieldsToDocumentTypeParams, {
		log = logDummy
} = {}) :Fields {
	log.debug(`data:${toStr(data)}`);
	if (!isFields(fields, { log })) { // NOTE Allowing empty array
		throw new TypeError(`addExtraFieldsToDocumentType: fields not of type Fields! fields:${toStr(fields)}`);
	}
	const returnFields = JSON.parse(JSON.stringify(fields));
	const fieldsObj = fieldsArrayToObj(fields, { log });
	traverse(fields).forEach(function(/*value*/) { // Fat arrow destroys this
		if (
			this.notRoot
			&& !this.path[0].startsWith('_')
			&& !this.circular // Why?
		) {
			const pathString = this.path.join('.');
			const field :Omit<Field, 'name'> = fieldsObj[pathString];
			if (!field) { // Field has no definition
				//const valueTypeForPath = fieldObj[pathString].valueType || VALUE_TYPE_STRING;
				// TODO detect type from value
			} // if !field
		}
	}); // traverse
	return returnFields;
}
