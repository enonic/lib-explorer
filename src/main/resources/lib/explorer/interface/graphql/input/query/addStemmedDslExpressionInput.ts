import type { Glue } from "../../utils/Glue";

// @ts-ignore No types yet.
import { GraphQLFloat, GraphQLString, list, nonNull } from '/lib/graphql';

import { GQL_INPUT_TYPE } from "../constants";
import { addDslOperatorEnum } from "./addDslOperatorEnum";
import { addStemmingLanguageEnum } from "./addStemmingLanguageEnum";

export function addStemmedDslExpressionInput({ glue }: { glue: Glue; }) {
	return glue.addInputType({
		name: GQL_INPUT_TYPE.STEMMED_DSL_EXPRESSION,
		fields: {
			fields: { type: nonNull(list(GraphQLString)) },

			// Optional, will fallback to decoratedSearchString
			query: { type: GraphQLString },

			// Optional, will fallback to languages[0]
			language: { type: addStemmingLanguageEnum({ glue }) },

			operator: { type: addDslOperatorEnum({ glue }) },
			boost: { type: GraphQLFloat },
		}
	});
}
