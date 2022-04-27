import {ZeroOrMore} from '/lib/explorer/types.d';
import type {
	Interface,
	InterfaceField,
	InterfaceNode
} from '../types/Interface.d';

import {
	forceArray,
	isNotSet
} from '@enonic/js-utils';

// Reference doesn't work well when diffing or printing, so let's do that in the model


export function coerseInterfaceTypeCollectionIds(
	collectionIds :ZeroOrMore<string>
) :Array<string> {
	return isNotSet(collectionIds) ? [] : forceArray(collectionIds);
}


export function coerseInterfaceTypeFields(
	fields :ZeroOrMore<InterfaceField>
) :Array<InterfaceField> {
	return isNotSet(fields) ? [] : forceArray(fields);
}


export function coerseInterfaceTypeStopWords(
	stopWords :ZeroOrMore<string>
) :Array<string> {
	return isNotSet(stopWords) ? [] : forceArray(stopWords);
}


export function coerseInterfaceTypeSynonymIds(
	synonymIds :ZeroOrMore<string>
) :Array<string> {
	return isNotSet(synonymIds) ? [] : forceArray(synonymIds);
}


export const coerseInterfaceType = ({
	_id,
	_name,
	//_nodeType, // No point exposing, always the same
	_path,
	_versionKey,
	collectionIds,
	fields = [],
	//stopWordIds = [],
	stopWords,
	synonymIds//,
	//...rest
} :InterfaceNode ) :Interface => ({
	_id,
	_name,
	//_nodeType, // No point exposing, always the same
	_path,
	_versionKey,
	collectionIds: coerseInterfaceTypeCollectionIds(collectionIds),
	fields: coerseInterfaceTypeFields(fields),
	//stopWordIds: forceArray(stopWordIds),//.map((stopWordId) => reference(stopWordId)), // empty array allowed,
	stopWords: coerseInterfaceTypeStopWords(stopWords),
	synonymIds: coerseInterfaceTypeSynonymIds(synonymIds)
});
