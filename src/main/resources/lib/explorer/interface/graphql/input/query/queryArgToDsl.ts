import type { QueryDsl } from "@enonic-types/lib-node";
import type { BooleanDslExpressionInput, DslExpressionType, FulltextDslExpressionInput, NgramDslExpressionInput, QueryDslInput, StemmedDslExpressionInput, TermDslExpressionInput } from "./QueryDslInput";

import { toStr } from '@enonic/js-utils/value/toStr';
import { isNotNil } from "/lib/explorer/typeGuards/isNotNil";
import { isNil } from "/lib/explorer/typeGuards/isNil";

const TRACE = false;
const LOG_PREFIX = 'queryArgToDsl:';

export function queryArgToDsl({
    _trace = TRACE,
    decoratedSearchString,
    languages = [],
    queryArg,
}: {
	_trace?: boolean;
	decoratedSearchString: string | undefined;
	languages?: string[];
	queryArg: QueryDslInput;
}): QueryDsl {
    if (_trace) log.info('%s languages:%s', LOG_PREFIX, toStr(languages));
    if (_trace) log.info('%s queryArg:%s', LOG_PREFIX, toStr(queryArg));

    const fieldKeys = Object.keys(queryArg);
    if (_trace) log.info('%s fieldKeys:%s', LOG_PREFIX, toStr(fieldKeys));

    if (!fieldKeys.length) {
        throw new Error(
            'QueryDslInput has no field! One of: boolean, fulltext, ngram, stemmed, term.'
        );
    }

    if (fieldKeys.length > 1) {
        throw new Error(`QueryDslInput has more than one field! ${toStr(fieldKeys)}`);
    }

    const dslExpression = fieldKeys[0] as DslExpressionType;
    if (_trace) log.info('%s dslExpression:%s', LOG_PREFIX, toStr(dslExpression));

    switch (dslExpression) {
    case 'boolean': {
        const {
            boost,
            must,
            mustNot,
            should
        } = queryArg.boolean as BooleanDslExpressionInput;
        if (!(must || mustNot || should)) {
            throw new Error(`BooleanDslExpressionInput without clause! ${toStr(queryArg.boolean)}`);
        }
        const queryDsl: QueryDsl = {
            boolean: {}
        };
        if (boost) queryDsl.boolean.boost = boost;
        if (must) {
            queryDsl.boolean.must = must.map(item => queryArgToDsl({
                decoratedSearchString,
                languages,
                queryArg: item
            }));
        }
        if (mustNot) {
            queryDsl.boolean.mustNot = mustNot.map(item => queryArgToDsl({
                decoratedSearchString,
                languages,
                queryArg: item
            }));
        }
        if (should) {
            queryDsl.boolean.should = should.map(item => queryArgToDsl({
                decoratedSearchString,
                languages,
                queryArg: item
            }));
        }
        if (_trace) log.info('%s queryDsl:%s', LOG_PREFIX, toStr(queryDsl));
        return queryDsl;
    }
    case 'fulltext': {
        const {
            fields,
            query: queryField,
            boost,
            operator
        } = queryArg.fulltext as FulltextDslExpressionInput;
        const query = queryField || decoratedSearchString;
        if (!query) {
            throw new Error(`Both query and fallback decoratedSearchString is falsy! ${
                toStr(queryArg.fulltext)
            }`);
        }
        const queryDsl: QueryDsl = {
            fulltext: {
                fields,
                query,
            }
        };
        if (boost) queryDsl.fulltext.boost = boost;
        if (operator) queryDsl.fulltext.operator = operator;
        if (_trace) log.info('%s queryDsl:%s', LOG_PREFIX, toStr(queryDsl));
        return queryDsl;
    }
    case 'ngram': {
        const {
            fields,
            query: queryField,
            boost,
            operator
        } = queryArg.ngram as NgramDslExpressionInput;
        const query = queryField || decoratedSearchString;
        if (!query) {
            throw new Error(`Both query and fallback decoratedSearchString is falsy! ${
                toStr(queryArg.ngram)
            }`);
        }
        const queryDsl: QueryDsl = {
            ngram: {
                fields,
                query,
            }
        };
        if (boost) queryDsl.ngram.boost = boost;
        if (operator) queryDsl.ngram.operator = operator;
        if (_trace) log.info('%s queryDsl:%s', LOG_PREFIX, toStr(queryDsl));
        return queryDsl;
    }
    case 'stemmed': {
        const {
            fields,
            query: queryField,
            language: languageField,
            boost,
            operator
        } = queryArg.stemmed as StemmedDslExpressionInput;
        const query = queryField || decoratedSearchString;
        if (!query) {
            throw new Error(`Both query and fallback decoratedSearchString is falsy! ${
                toStr(queryArg.stemmed)
            }`);
        }
        const language = languageField || languages[0];
        if (!language) {
            throw new Error(
                `StemmedDslExpressionInput without language and no languages[0] fallback! ${
                    toStr(queryArg.stemmed)
                }`
            );
        }
        const queryDsl: QueryDsl = {
            stemmed: {
                fields,
                language,
                query,
            }
        };
        if (boost) queryDsl.stemmed.boost = boost;
        if (operator) queryDsl.stemmed.operator = operator;
        if (_trace) log.info('%s queryDsl:%s', LOG_PREFIX, toStr(queryDsl));
        return queryDsl;
    }
    case 'term': {
        const {
            field,
            value: valueField,
            boost,
            type
        } = queryArg.term as TermDslExpressionInput;
        const {
            boolean,
            double,
            instant,
            localDate,
            localDateTime,
            localTime,
            long,
            string
        } = valueField;
        const value = isNotNil(string) ? string
            : isNotNil(boolean) ? boolean
                : isNotNil(long) ? long
                    : isNotNil(double) ? double
                        : isNotNil(instant) ? instant
                            : isNotNil(localDate) ? localDate
                                : isNotNil(localDateTime) ? localDateTime
                                    : isNotNil(localTime) ? localTime
                                        : undefined;
        if (isNil(value)) {
            throw new Error(`TermDslExpressionInput without value! ${toStr(queryArg.term)}`);
        }
        const queryDsl: QueryDsl = {
            term: {
                field,
                value
            }
        };
        if (boost) queryDsl.term.boost = boost;
        if (type) queryDsl.term.type = type;
        if (_trace) log.info('%s queryDsl:%s', LOG_PREFIX, toStr(queryDsl));
        return queryDsl;
    }
    default:
        throw new Error(`Unsupported DslExpression:${dslExpression}!`);
    } // swith dslExpression
} // decorateQueryArg
