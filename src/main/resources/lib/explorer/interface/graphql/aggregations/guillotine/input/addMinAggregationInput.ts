import type {GraphQL} from '/lib/explorer/interface/graphql/index.d';
import type {Glue} from '/lib/explorer/interface/graphql/utils/Glue';


import {
	GraphQLString,
	nonNull
	// @ts-expect-error No types yet
} from '/lib/graphql';
import {GQL_INPUT_TYPE_AGGREGATION_MIN} from '/lib/explorer/interface/graphql/aggregations/guillotine/constants';


export function addMinAggregationInput({
	fieldType = GraphQLString, // What guillotine uses
	glue
}: {
	fieldType?: GraphQL.ArgsType
	glue: Glue
}) {
	return glue.addInputType({
		name: GQL_INPUT_TYPE_AGGREGATION_MIN,
		description: 'MinAggregation input type',
		fields: {
			field: {
				type: nonNull(fieldType)
			}
		}
	});
}
