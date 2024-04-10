import type {Glue} from '/lib/explorer/interface/graphql/utils/Glue';


import {
	GraphQLString,
	nonNull
	// @ts-expect-error No types yet
} from '/lib/graphql';
import {GQL_INPUT_TYPE_AGGREGATION_VALUE_COUNT} from '/lib/explorer/interface/graphql/aggregations/guillotine/constants';


export function addValueCountAggregationInput({
	glue
}: {
	glue: Glue
}) {
	return glue.addInputType({
		name: GQL_INPUT_TYPE_AGGREGATION_VALUE_COUNT,
		description: 'ValueCount Aggregation input type',
		fields: {
			field: {
				type: nonNull(GraphQLString)
			}
		}
	});
}
