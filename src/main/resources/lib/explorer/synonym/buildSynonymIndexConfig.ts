import type {
	IndexConfig,
	IndexConfigConfig,
	//SynonymNode,
	SynonymNodeCreateParams
} from '/lib/explorer/types/index.d';

import {
	sortByProperty//,
	//toStr
} from '@enonic/js-utils';
import {javaLocaleToSupportedLanguage as stemmingLanguageFromLocale} from '/lib/explorer/stemming/javaLocaleToSupportedLanguage';


const COMMENT_CONFIG = {
	decideByType: false, // string
	enabled: true,
	fulltext: true,
	includeInAllText: false,
	nGram: false,
	path: false
};

const ENABLED_CONFIG = {
	decideByType: false, // boolean
	enabled: true,
	fulltext: false,
	includeInAllText: false,
	nGram: false,
	path: false
};

const DISABLED_IN_INTERFACES_CONFIG = {
	decideByType: false, // Array<reference>
	enabled: true,
	fulltext: false,
	includeInAllText: false,
	nGram: false,
	path: false
};


export function buildSynonymIndexConfig({
	partialSynonymNode
} :{
	partialSynonymNode :SynonymNodeCreateParams //Partial<SynonymNode>
}) {
	const indexConfig :IndexConfig = {
		configs: [{
			config: COMMENT_CONFIG,
			path: 'comment',
		},{
			config: ENABLED_CONFIG,
			path: 'enabled',
		},{
			config: DISABLED_IN_INTERFACES_CONFIG,
			path: 'disabledInInterfaces',
		}],
		default: {
			decideByType: false, // unknown
			enabled: false,
			fulltext: false,
			includeInAllText: false,
			nGram: false,
			path: false
		},
	};
	const {
		languages = {}
	} = partialSynonymNode;
	/*const aConfig :IndexConfigConfigsEntry = {
		/*config: {},
		path: 'languages'*
	};*/
	const locales = Object.keys(languages);
	for (let i = 0; i < locales.length; i++) {
		const locale = locales[i];

		indexConfig.configs.push({
			config: COMMENT_CONFIG,
			path: `languages.${locale}.comment`
		});

		indexConfig.configs.push({
			config: ENABLED_CONFIG,
			path: `languages.${locale}.enabled`
		});

		indexConfig.configs.push({
			config: DISABLED_IN_INTERFACES_CONFIG,
			path: `languages.${locale}.disabledInInterfaces`
		});

		indexConfig.configs.push({
			config: COMMENT_CONFIG,
			path: `languages.${locale}.synonyms.comment`
		});

		indexConfig.configs.push({
			config: ENABLED_CONFIG,
			path: `languages.${locale}.synonyms.enabled`
		});

		indexConfig.configs.push({
			config: DISABLED_IN_INTERFACES_CONFIG,
			path: `languages.${locale}.synonyms.disabledInInterfaces`
		});

		const synonymConfig :IndexConfigConfig = {
			decideByType: false, // string
			enabled: true,
			fulltext: true,
			includeInAllText: true,
			nGram: true,
			path: false,
		}

		let stemmingLanguage :string;
		try {
			stemmingLanguage = stemmingLanguageFromLocale(locale)
		} catch (e) {
			// no-op
		}
		//log.debug('locale:%s stemmingLanguage:%s', locale, stemmingLanguage);

		if (stemmingLanguage) {
			synonymConfig.languages = [stemmingLanguage];
		}

		indexConfig.configs.push({
			config: synonymConfig,
			path: `languages.${locale}.synonyms.synonym`
		});

		indexConfig.configs.push({
			config: {
				decideByType: false, // 'from'|'to'|'both'
				enabled: true,
				fulltext: false,
				includeInAllText: false,
				nGram: false,
				path: false
			},
			path: `languages.${locale}.synonyms.use`
		});
	} // for locales
	indexConfig.configs = sortByProperty(indexConfig.configs, 'path');

	//log.debug('indexConfig:%s', toStr(indexConfig));
	return indexConfig;
}
