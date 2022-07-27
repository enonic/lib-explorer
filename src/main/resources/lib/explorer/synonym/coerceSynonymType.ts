import type {
	SynonymNode,
	Synonym
} from '/lib/explorer/types/index.d';


import {
	forceArray//,
	//toStr
} from '@enonic/js-utils';


export function coerceSynonymType({
	_id,
	_name,
	_nodeType,
	_path,
	_score,
	_versionKey,
	comment = '',
	enabled = true,
	disabledInInterfaces = [],
	languages = {},
	//thesaurus,
	thesaurusReference,
} :SynonymNode & {
	_score ?:number
}) :Synonym & {
	_score ?:number
	thesaurus :string
} {
	const locales = Object.keys(languages);
	//log.debug('locales:%s', toStr(locales));

	const coercedLanguages = {};
	for (let i = 0; i < locales.length; i++) {
		const locale = locales[i];
		//log.debug('locale:%s', toStr(locale));
		const {
			comment: languageComment = '',
			enabled: languageEnabled = true,
			disabledInInterfaces: languageDisabledInInterfaces = [],
			synonyms
		} = languages[locale];
		const coercedSynonyms = [];
		const synonymsArray = synonyms ? forceArray(synonyms) : [];
		for (let j = 0; j < synonymsArray.length; j++) {
			const {
				comment: languageSynonymsComment = '',
				enabled :languageSynonymsEnabled = true,
				disabledInInterfaces: languageSynonymsDisabledInInterfaces = [],
				synonym,
				use = 'to'
			} = synonymsArray[j];
			if (synonym) {
				coercedSynonyms.push({
					comment: languageSynonymsComment,
					enabled: languageSynonymsEnabled,
					disabledInInterfaces: languageSynonymsDisabledInInterfaces ? forceArray(languageSynonymsDisabledInInterfaces) : [],
					synonym,
					use // TODO? Check 'from','to','both'
				});
			}
		} // for synonymsArray
		//log.debug('coercedSynonyms:%s', toStr(coercedSynonyms));
		coercedLanguages[locale] = {
			comment: languageComment,
			enabled: languageEnabled,
			disabledInInterfaces: languageDisabledInInterfaces ? forceArray(languageDisabledInInterfaces) : [],
			synonyms: coercedSynonyms
		};
	} // for locales
	//log.debug('coercedLanguages:%s', toStr(coercedLanguages));

	return {
		_id,
		_name,
		_nodeType,
		_path,
		_score,
		_versionKey,
		comment,
		enabled,
		disabledInInterfaces: disabledInInterfaces ? forceArray(disabledInInterfaces) : [],
		languages: coercedLanguages,
		thesaurus: _path.match(/[^/]+/g)[1],
		thesaurusReference,
	};
}
