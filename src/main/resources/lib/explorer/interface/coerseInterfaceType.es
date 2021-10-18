import {
	forceArray,
	isNotSet
} from '@enonic/js-utils';

// Reference doesn't work well when diffing or printing, so let's do that in the model


export function coerseInterfaceTypeCollectionIds(collectionIds) {
	return isNotSet(collectionIds) ? [] : forceArray(collectionIds);
}


export function coerseInterfaceTypeFields(fields) {
	return isNotSet(fields) ? [] : forceArray(fields);
}


export function coerseInterfaceTypeStopWords(stopWords) {
	return isNotSet(stopWords) ? [] : forceArray(stopWords);
}


export function coerseInterfaceTypeSynonymIds(synonymIds) {
	return isNotSet(synonymIds) ? [] : forceArray(synonymIds);
}


export const coerseInterfaceType = ({
	_id,
	_name,
	_nodeType,
	_path,
	_versionKey,
	collectionIds,
	fields = [],
	//stopWordIds = [],
	stopWords,
	synonymIds
}) => ({
	_id,
	_name,
	_nodeType,
	_path,
	_versionKey,
	collectionIds: coerseInterfaceTypeCollectionIds(collectionIds),
	fields: coerseInterfaceTypeFields(fields),
	//stopWordIds: forceArray(stopWordIds),//.map((stopWordId) => reference(stopWordId)), // empty array allowed,
	stopWords: coerseInterfaceTypeStopWords(stopWords),
	synonymIds: coerseInterfaceTypeSynonymIds(synonymIds)
});
