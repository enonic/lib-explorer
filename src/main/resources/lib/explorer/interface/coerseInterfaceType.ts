import {
	Interface,
	InterfaceField,
	InterfaceNode,
	ZeroOrMore
} from '/lib/explorer/types/index.d';


import {
	forceArray,
	isNotSet
} from '@enonic/js-utils';
import {NT_INTERFACE} from '/lib/explorer/constants';

// Reference doesn't work well when diffing or printing, so let's do that in the model


export function coerseInterfaceTypeCollectionIds(
	collectionIds :ZeroOrMore<string>
) :Array<string> {
	return isNotSet(collectionIds) ? [] : forceArray(collectionIds);
}


export function coerseInterfaceTypeFields(
	fields :ZeroOrMore<InterfaceField>
) :Array<InterfaceField> {
	return isNotSet(fields) ? [] : forceArray(fields).map(({ // empty array allowed
		boost, // undefined allowed
		name
	}) => ({
		boost,
		name
	}));
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

	//@ts-ignore
	_nodeType, // eslint-disable-line @typescript-eslint/no-unused-vars

	_path,
	_versionKey,  // GraphQL Interface Node needs this
	collectionIds,
	fields = [],
	//stopWordIds = [],
	stopWords,
	synonymIds//,
	//...rest
} :InterfaceNode ) :Interface => ({
	_id,
	_name,
	_nodeType: NT_INTERFACE,  // GraphQL Interface Node needs this
	_path,
	_versionKey,  // GraphQL Interface Node needs this
	collectionIds: coerseInterfaceTypeCollectionIds(collectionIds),
	fields: coerseInterfaceTypeFields(fields),
	//stopWordIds: forceArray(stopWordIds),//.map((stopWordId) => reference(stopWordId)), // empty array allowed,
	stopWords: coerseInterfaceTypeStopWords(stopWords),
	synonymIds: coerseInterfaceTypeSynonymIds(synonymIds)
});
