import {
	Interface,
	InterfaceField,
	InterfaceNode,
	ZeroOrMore
} from '@enonic-types/lib-explorer';
import {
	TermQuery
} from '@enonic-types/lib-explorer/Interface.d';


import {NT_INTERFACE} from '/lib/explorer/constants';
import { noNilsArray } from '@enonic/js-utils/array/noNilsArray';

// Reference doesn't work well when diffing or printing, so let's do that in the model


export function coerseInterfaceTypeCollectionIds(
	collectionIds: ZeroOrMore<string>
): string[] {
	return noNilsArray(collectionIds);
}


export function coerseInterfaceTypeFields(
	fields: ZeroOrMore<InterfaceField>
): InterfaceField[] {
	return noNilsArray(fields).map(({ // empty array allowed
		boost, // undefined allowed
		name
	}) => ({
		boost,
		name
	}));
}


export function coerseInterfaceTypeStopWords(
	stopWords: ZeroOrMore<string>
): string[] {
	return noNilsArray(stopWords);
}


export function coerseInterfaceTypeSynonymIds(
	synonymIds: ZeroOrMore<string>
): string[] {
	return noNilsArray(synonymIds);
}


export function coerseInterfaceTypeTermQueries(
	termQueries: ZeroOrMore<TermQuery>
): TermQuery[] {
	return noNilsArray(termQueries);
}


export const coerseInterfaceType = ({
	_id,
	_name,

	//@ts-ignore
	_nodeType, // eslint-disable-line @typescript-eslint/no-unused-vars

	_path,
	_versionKey,  // GraphQL Interface Node needs this
	collectionIds,
	expressions,
	fields = [],
	//stopWordIds = [],
	stopWords,
	synonymIds,
	termQueries,
	//...rest
}: InterfaceNode): Interface => ({
	_id,
	_name,
	_nodeType: NT_INTERFACE, // GraphQL Interface Node needs this
	_path,
	_versionKey,  // GraphQL Interface Node needs this
	collectionIds: coerseInterfaceTypeCollectionIds(collectionIds),
	expressions,
	fields: coerseInterfaceTypeFields(fields),
	//stopWordIds: forceArray(stopWordIds),//.map((stopWordId) => reference(stopWordId)), // empty array allowed,
	stopWords: coerseInterfaceTypeStopWords(stopWords),
	synonymIds: coerseInterfaceTypeSynonymIds(synonymIds),
	termQueries: coerseInterfaceTypeTermQueries(termQueries),
});
