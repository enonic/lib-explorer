import type { Glue } from "../../utils/Glue";

// @ts-ignore No types yet.
import { GraphQLFloat, list, reference } from '/lib/graphql';

import { GQL_INPUT_TYPE } from "../constants";

export function addBooleanDslExpressionInput({ glue }: { glue: Glue; }) {
	return glue.addInputType({
		name: GQL_INPUT_TYPE.BOOLEAN_DSL_EXPRESSION,
		fields: {
			should: { type: list(reference(GQL_INPUT_TYPE.QUERY_DSL)) },
			must: { type: list(reference(GQL_INPUT_TYPE.QUERY_DSL)) },
			mustNot: { type: list(reference(GQL_INPUT_TYPE.QUERY_DSL)) },
			// filter,
			boost: { type: GraphQLFloat },
		}
	});
}
