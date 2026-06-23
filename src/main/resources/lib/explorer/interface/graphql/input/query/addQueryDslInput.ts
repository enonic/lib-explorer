import type { Glue } from "../../utils/Glue";
import { GQL_INPUT_TYPE } from "../constants";
import { addBooleanDslExpressionInput } from "./addBooleanDslExpressionInput";
import { addFulltextDslExpressionInput } from "./addFulltextDslExpressionInput";
import { addNgramDslExpressionInput } from "./addNgramDslExpressionInput";
import { addStemmedDslExpressionInput } from "./addStemmedDslExpressionInput";
import { addTermDslExpressionInput } from "./addTermDslExpressionInput";

export function addQueryDslInput({ glue }: { glue: Glue; }) {
	return glue.addInputType({
		name: GQL_INPUT_TYPE.QUERY_DSL,
		fields: {
			boolean: { type: addBooleanDslExpressionInput({ glue }) },
			// exists,
			fulltext: { type: addFulltextDslExpressionInput({ glue }) },
			// in,
			// like,
			// matchAll,
			ngram: { type: addNgramDslExpressionInput({ glue }) },
			// pathMatch,
			// range,
			stemmed: { type: addStemmedDslExpressionInput({ glue }) },
			term: { type: addTermDslExpressionInput({ glue }) },
		}
	});
}
