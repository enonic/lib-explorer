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
	collectionIds = [],
	fields = [],// TODO? = DEFAULT_INTERFACE_FIELDS,
	stopWords = [],
	synonymIds = []
} = {}) => ({
	_id,
	_name,
	_path,
	collectionIds: forceArray(collectionIds),
	fields: forceArray(fields),
	stopWords: forceArray(stopWords),
	synonymsIds: forceArray(synonymIds)
});
