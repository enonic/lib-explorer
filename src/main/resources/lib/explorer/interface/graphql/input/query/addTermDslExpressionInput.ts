

import type { Glue } from "../../utils/Glue";

// @ts-ignore No types yet.
import { GraphQLFloat, GraphQLString, nonNull } from '/lib/graphql';

import { GQL_INPUT_TYPE } from "../constants";
import { addDslQueryTypeEnum } from "./addDslQueryTypeEnum";
import { addValueDslExpressionInput } from "./addValueDslExpressionInput";

export function addTermDslExpressionInput({ glue }: { glue: Glue; }) {
	return glue.addInputType({
		name: GQL_INPUT_TYPE.TERM_DSL_EXPRESSION,
		fields: {
			field: { type: nonNull(GraphQLString) },
			value: { type: nonNull(addValueDslExpressionInput({ glue })) },
			type: { type: addDslQueryTypeEnum({ glue }) },
			boost: { type: GraphQLFloat },
		}
	});
}
