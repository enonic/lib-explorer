import {
	STEMMING_LANGUAGES,
	toStr
} from '@enonic/js-utils';

import {getLocales} from '/lib/explorer/locale/getLocales';


const CODE_TO_LANG = {};
const LANG_TO_CODE = {};
STEMMING_LANGUAGES.forEach(({code, language}) => {
	CODE_TO_LANG[code] = language;
	LANG_TO_CODE[language] = code;
});


const KNOWN_LOCALES = {
	nb: 'no',
	'nb-NO': 'no',
	'nb-SJ': 'no',
	'nn': 'no',
	'nn-NO': 'no',
	//'no': 'no'
	'no-NO': 'no'
};


export function javaLocaleToSupportedLanguage(javaLocale) {
	//log.info(`javaLocale:${toStr(javaLocale)}`);

	const localeMatchesLangCode = CODE_TO_LANG[javaLocale];
	if (localeMatchesLangCode) {
		log.debug(`localeMatchesLangCode javaLocale:${javaLocale}`);
		return javaLocale;
	}

	const known = KNOWN_LOCALES[javaLocale];
	if (known) {
		log.debug(`known:${known} javaLocale:${javaLocale}`);
		return known;
	}

	const locales = getLocales({
		locale: 'en',//javaLocale,
		query: javaLocale
	});
	//log.debug(`locales:${toStr(locales)}`);

	if (!locales.length) {
		throw new Error(`Unable to find java locale:${javaLocale}!`);
	}

	let firstMatch;
	for (let lang of Object.keys(LANG_TO_CODE)) {
		if (locales[0].displayName.includes(lang)) {
			firstMatch = LANG_TO_CODE[lang];
			log.debug(`firstMatch:${firstMatch} javaLocale:${javaLocale} locales:${toStr(locales)}`);
			break;
		}
	}
	if (firstMatch) {
		return firstMatch;
	}
	throw new Error(`Unable to guess supported language from java locale:${javaLocale} locales:${toStr(locales)}!`);
}

/*

[
    {
        "country": "NO",
        "displayCountry": "Norge",
        "displayLanguage": "norsk bokmål",
        "displayName": "norsk bokmål (Norge)",
        "displayVariant": "",
        "language": "nb",
        "tag": "nb-NO",
        "variant": ""
    }
]

[
    {
        "country": "",
        "displayCountry": "",
        "displayLanguage": "Norwegian Bokmål",
        "displayName": "Norwegian Bokmål",
        "displayVariant": "",
        "language": "nb",
        "tag": "nb",
        "variant": ""
    },
    {
        "country": "NO",
        "displayCountry": "Norway",
        "displayLanguage": "Norwegian Bokmål",
        "displayName": "Norwegian Bokmål (Norway)",
        "displayVariant": "",
        "language": "nb",
        "tag": "nb-NO",
        "variant": ""
    },
    {
        "country": "SJ",
        "displayCountry": "Svalbard & Jan Mayen",
        "displayLanguage": "Norwegian Bokmål",
        "displayName": "Norwegian Bokmål (Svalbard & Jan Mayen)",
        "displayVariant": "",
        "language": "nb",
        "tag": "nb-SJ",
        "variant": ""
    }
]

*/
