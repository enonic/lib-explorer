

import type { Glue } from "../../utils/Glue";
import { GQL_ENUM_TYPE } from "../constants";

export function addStemmingLanguageEnum({ glue }: { glue: Glue; }) {
	return glue.addEnumType({
		name: GQL_ENUM_TYPE.DSL_STEMMING_LANGUAGE,
		values: {
			ar:'ar',
			bg: 'bg',
			bn: 'bn',
			ca: 'ca',
			cs: 'cs',
			da: 'da',
			de: 'de',
			el: 'el',
			en: 'en',
			eu: 'eu',
			fa: 'fa',
			fi: 'fi',
			fr: 'fr',
			ga: 'ga',
			gl: 'gl',
			in: 'in',
			hu: 'hu',
			hy: 'hy',
			id: 'id',
			it: 'it',
			ja: 'ja',
			ko: 'ko',
			ku: 'ku',
			lt: 'lt',
			lv: 'lv',
			nl: 'nl',
			no: 'no',
			pt: 'pt',
			ptBR: 'pt-BR',
			ro: 'ro',
			ru: 'ru',
			es: 'es',
			sv: 'sv',
			tr: 'tr',
			th: 'th',
			zh: 'zh',
		}
	});
}
