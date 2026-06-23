import type {
	QueryDsl
} from '@enonic-types/lib-node';

export interface BooleanDslExpressionInput {
    should?: QueryDslInput[];
    must?: QueryDslInput[];
    mustNot?: QueryDslInput[];
    // filter?: QueryDslInput[];
    boost?: number;
}

export type DslOperatorEnum = 'OR' | 'AND';

export type DslQueryTypeEnum = 'dateTime' | 'time';

export interface FulltextDslExpressionInput {
	fields: string[];
	query?: string;
	operator?: DslOperatorEnum;
	boost?: number;
}

export interface NgramDslExpressionInput {
	fields: string[];
	query?: string;
	operator?: DslOperatorEnum;
	boost?: number;
}

export type QueryDslInput = {
	boolean?: BooleanDslExpressionInput;
// 	exists?: ExistsDslExpressionInput;
	fulltext?: FulltextDslExpressionInput;
	ngram?: NgramDslExpressionInput;
	stemmed?: StemmedDslExpressionInput;
// 	matchAll?: MatchAllDslExpressionInput;
// 	pathMatch?: PathMatchDslExpressionInput;
// 	range?: RangeDslExpressionInput;
// 	like?: LikeDslExpressionInput;
// 	in?: InDslExpressionInput;
	term?: TermDslExpressionInput;
};

export type DslExpressionType =
	| 'boolean'
	| 'fulltext'
	| 'ngram'
	| 'stemmed'
	| 'term';

export type StemmingLanguageCode =
	| 'ar'
	| 'bg'
	| 'bn'
	| 'ca'
	| 'cs'
	| 'da'
	| 'de'
	| 'el'
	| 'en'
	| 'eu'
	| 'fa'
	| 'fi'
	| 'fr'
	| 'ga'
	| 'gl'
	| 'in'
	| 'hu'
	| 'hy'
	| 'id'
	| 'it'
	| 'ja'
	| 'ko'
	| 'ku'
	| 'lt'
	| 'lv'
	| 'nl'
	| 'no'
	| 'pt'
	| 'pt-BR'
	| 'ro'
	| 'ru'
	| 'es'
	| 'sv'
	| 'tr'
	| 'th'
	| 'zh';

export interface StemmedDslExpressionInput {
	fields: string[];
	query?: string;
	language?: StemmingLanguageCode;
	operator?: DslOperatorEnum;
	boost?: number;
}

export interface TermDslExpressionInput {
	field: string;
	value: {
		string?: string;
		double?: number;
		long?: number;
		boolean?: boolean;
		localDate?: string;
		localDateTime?: string;
		localTime?: string;
		instant?: string;
	};
	type?: DslQueryTypeEnum;
	boost?: number;
}
