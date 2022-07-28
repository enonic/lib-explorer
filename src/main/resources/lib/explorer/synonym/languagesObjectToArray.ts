import type {
	SynonymLanguage,
	SynonymLanguages
} from '/lib/explorer/types/Synonym';


import {sortByProperty} from '@enonic/js-utils'


export function languagesObjectToArray({
	languagesObject
} :{
	languagesObject :SynonymLanguages
}) {
	const languagesArray :Array<
		SynonymLanguage & {locale :string}
	>= [];
	const locales = Object.keys(languagesObject);
	for (let i = 0; i < locales.length; i++) {
		const locale = locales[i];
		languagesArray.push({
			...languagesObject[locale],
			locale
		});
	}
	return sortByProperty(languagesArray, 'locale');
}
