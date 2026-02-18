import type {
	OneOrMore,
	Synonym_Language,
	Synonym_LanguagesSynonymObject,
	SynonymNode_Languages,
	SynonymNode_LanguagesSynonymObject
} from '../types.d';


import {
	forceArray,
	sortByProperty
} from '@enonic/js-utils'


function synonymNode_LanguagesSynonymObject_To_synonym_LanguagesSynonymObject({
	synonymNode_LanguagesSynonymObject
} :{
	synonymNode_LanguagesSynonymObject :SynonymNode_LanguagesSynonymObject
}) :Synonym_LanguagesSynonymObject {
	const {
		comment = '',
		enabled = true,
		disabledInInterfaces = [],
		synonym
	} = synonymNode_LanguagesSynonymObject;
	return {
		comment,
		enabled,
		disabledInInterfaces: disabledInInterfaces ? forceArray(disabledInInterfaces) : [],
		synonym
	};
}


function oneOrMore_SynonymNode_LanguagesSynonymObjects_To_arrayOf_Synonym_LanguagesSynonymObjects({
	oneOrMore_SynonymNode_LanguagesSynonymObjects
} :{
	oneOrMore_SynonymNode_LanguagesSynonymObjects :OneOrMore<SynonymNode_LanguagesSynonymObject>
}) {
	return forceArray(oneOrMore_SynonymNode_LanguagesSynonymObjects)
		.map((synonymNode_LanguagesSynonymObject) => synonymNode_LanguagesSynonymObject_To_synonym_LanguagesSynonymObject({
			synonymNode_LanguagesSynonymObject
		}));
}


export function languagesObjectToArray({
	languagesObject
} :{
	languagesObject :SynonymNode_Languages
}) {
	if (!languagesObject) {
		return [];
	}
	const languagesArray :Array<Synonym_Language>= [];
	const locales = Object.keys(languagesObject);
	for (let i = 0; i < locales.length; i++) {
		const locale = locales[i];
		const {
			both = [],
			comment = '',
			enabled = true,
			disabledInInterfaces = [],
			from = [],
			to = [],
		} = languagesObject[locale];
		languagesArray.push({
			both: both ? oneOrMore_SynonymNode_LanguagesSynonymObjects_To_arrayOf_Synonym_LanguagesSynonymObjects({
				oneOrMore_SynonymNode_LanguagesSynonymObjects: both
			}) : [],
			comment,
			enabled,
			disabledInInterfaces: disabledInInterfaces ? forceArray(disabledInInterfaces) : [],
			from: from ? oneOrMore_SynonymNode_LanguagesSynonymObjects_To_arrayOf_Synonym_LanguagesSynonymObjects({
				oneOrMore_SynonymNode_LanguagesSynonymObjects: from
			}) : [],
			locale,
			to: to ? oneOrMore_SynonymNode_LanguagesSynonymObjects_To_arrayOf_Synonym_LanguagesSynonymObjects({
				oneOrMore_SynonymNode_LanguagesSynonymObjects: to
			}) : []
		});
	}
	return sortByProperty(languagesArray, 'locale');
}
