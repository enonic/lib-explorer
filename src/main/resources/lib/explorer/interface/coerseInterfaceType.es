import {forceArray} from '@enonic/js-utils';

// Reference doesn't work well when diffing or printing, so let's do that in the model

export const coerseInterfaceType = ({
	_id,
	_name,
	_nodeType,
	_path,
	_versionKey,
	collectionIds = [],
	fields = [],
	//stopWordIds = [],
	stopWords = [],
	synonymIds = []
}) => ({
	_id,
	_name,
	_nodeType,
	_path,
	_versionKey,

	collectionIds: forceArray(collectionIds),// Applying reference in model // empty array allowed,
	fields: forceArray(fields),
	//stopWordIds: forceArray(stopWordIds),//.map((stopWordId) => reference(stopWordId)), // empty array allowed,
	stopWords: forceArray(stopWords),
	synonymIds: forceArray(synonymIds)// Applying reference in model // empty array allowed,
});
