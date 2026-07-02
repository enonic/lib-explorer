export const GQL_ENUM_TYPE = {
	DSL_OPERATOR: 'DslOperatorEnum',
	DSL_QUERY_TYPE: 'DslQueryTypeEnum',
	DSL_STEMMING_LANGUAGE: 'DslStemmingLanguageEnum',
} as const;

export const GQL_ENUM_TYPE_NAME_GEO_DISTANCE_UNIT = 'GeoDistanceUnit'

export const GQL_INPUT_TYPE = {
	BOOLEAN_DSL_EXPRESSION: 'BooleanDslExpressionInput',
	FULLTEXT_DSL_EXPRESSION: 'FulltextDslExpressionInput',
	NGRAM_DSL_EXPRESSION: 'NgramDslExpressionInput',
	QUERY_DSL: 'QueryDslInput',
	STEMMED_DSL_EXPRESSION: 'StemmedDslExpressionInput',
	TERM_DSL_EXPRESSION: 'TermDslExpressionInput',
	VALUE_DSL_EXPRESSION: 'ValueDslExpressionInput',
} as const;

export const GQL_INPUT_TYPE_SORT = 'SortInput';
export const GQL_INPUT_TYPE_SORT_LOCATION = 'SortLocationInput';
export const GQL_INPUT_TYPE_SYNOYMS = 'SynonymsInput';


