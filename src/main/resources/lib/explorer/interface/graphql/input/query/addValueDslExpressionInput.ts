import type { Glue } from "../../utils/Glue";

import {
	Date as GraphQLDate,
	DateTime as GraphQLDateTime,
	GraphQLBoolean,
	GraphQLFloat,
	GraphQLInt,
	GraphQLString,
	LocalDateTime as GraphQLLocalDateTime,
	LocalTime as GraphQLLocalTime
	// @ts-ignore No types yet.
} from '/lib/graphql';

import { GQL_INPUT_TYPE } from "../constants";

export function addValueDslExpressionInput({ glue }: { glue: Glue; }) {
	return glue.addInputType({
		name: GQL_INPUT_TYPE.VALUE_DSL_EXPRESSION,
		fields: {
			string: { type: GraphQLString },
			double: { type: GraphQLFloat },
			long: { type: GraphQLInt },
			boolean: { type: GraphQLBoolean },
			localDate: { type: GraphQLDate },
			localDateTime: { type: GraphQLLocalDateTime },
			localTime: { type: GraphQLLocalTime },
			instant: { type: GraphQLDateTime },
		}
	});
}
