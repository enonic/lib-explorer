import type { QueryDsl } from '@enonic-types/core';

import { storage } from '@enonic/js-utils';


const bool = storage.query.dsl.bool;

// ref: https://developer.enonic.com/docs/platform/7.x/storage/dsl
// must: All expressions must evaluate to true to include a node in the result.
// should: One or more expressions must evaluate to true to include a node in the result. <- misleading!
// mustNot: All expressions in the mustNot must evaluate to false for nodes to match.
// const must = storage.query.dsl.must;
// const mustNot = storage.query.dsl.mustNot;
// const should = storage.query.dsl.should;

// My thinking:
// S: SelectionExpressions
// T: BoostExpressions
// S || T would give too much results (stuff outside Selection)
// S && T would give too few results (excludes everything that doesn't match atleastone BoostExpression)
// S || (S && T) includes the correct results, but the score for S twice.
// (S && !T) || (S && T) Score becomes Score(S) || (Score(S) + Score(T))

// According to AI:
//
// Scenario 1: should is used ALONE
// If a bool query contains only should clauses (no must, no filter), then:
// at least one should clause must match for the document to be included in the results.
//
// Example: "Give me documents that match A or B."
// Behavior: If 0 should clauses match, the document is dropped.
//
// Scenario 2: should is used WITH must or filter
// If a bool query contains a must or a filter clause, the should clauses become completely
// optional. They no longer dictate whether a document is included or excluded.
// They exist purely to add to the relevance score.
//
// Example: "Give me documents that MUST match A. If they SHOULD match B, boost their score."
// Behavior: Documents matching only A are included. Documents matching A and B are included and
// score higher.
//
// The minimum_should_match parameter
// Under the hood, Elasticsearch controls this with a parameter called minimum_should_match.
//
// If there is a must or filter, minimum_should_match defaults to 0 (meaning 0 should clauses need
// to match, as long as the must matches).
// If there are no must or filter clauses, minimum_should_match defaults to 1
// (meaning at least 1 should clause must match for the document to be included).
//
// Conclusion for your use case
// Because you are doing MUST (S) + SHOULD (T), the should will act exactly as a boost:
// it will not exclude documents that match S but fail to match T.
//
// So, your logic (S && !T) || (S && T) is still the correct theoretical logic, but structuring it
// as MUST(S) + SHOULD(T) in Enonic/Elasticsearch is the correct practical implementation.
//
// While your boolean logic is mathematically correct, writing it as (S && !T) || (S && T) forces
// the search engine to evaluate S twice, evaluate T twice, and perform an expensive NOT operation
// (which can be slow depending on the size of the T set).

export default function boostedQuery(
	selectionExpressions: QueryDsl[],
	boostExpressions: QueryDsl[]
): QueryDsl {
	return bool({
		must: selectionExpressions,
		should: boostExpressions
	});
	// Correct but slower
	// const s = bool(should(selectionExpressions));
	// const b = bool(should(boostExpressions));
	// const notB = bool(mustNot(boostExpressions));
	// return bool(should([
	// 	bool(must([s, notB])),
	// 	bool(must([s, b])),
	// ]));
}
