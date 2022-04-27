import type {
	Interface,
	InterfaceNode
} from '../types/Interface.d';

import {
	forceArray//,
	//toStr
} from '@enonic/js-utils';

// Same as coerseInterfaceType... keeping until checked not in use...
// Reference doesn't work well when diffing or printing, so let's do that in the model

export const filter = ({
	_id,
	_name,
	_path,
	_versionKey,
	collectionIds = [],
	fields = [],// TODO? = DEFAULT_INTERFACE_FIELDS,
	stopWords = [],
	synonymIds = []
} :InterfaceNode/*{
	_id :string
	_name :string
	_path :string
	collectionIds? :string|Array<string>
	fields? :string|Array<string>
	stopWords? :string|Array<string>
	synonymIds? :string|Array<string>
}*/) :Interface => ({
	_id,
	_name,
	_path,
	_versionKey,
	collectionIds: forceArray(collectionIds),
	fields: forceArray(fields),
	stopWords: forceArray(stopWords),
	synonymIds: forceArray(synonymIds)
});
