import type {GraphQL} from '/lib/explorer/interface/graphql/index.d';
import type {Glue} from '/lib/explorer/interface/graphql/utils/Glue';


import {
	GraphQLString,
	nonNull
	// @ts-expect-error No types yet
} from '/lib/graphql';
import {GQL_INPUT_TYPE_AGGREGATION_STATS} from '/lib/explorer/interface/graphql/aggregations/guillotine/constants';


export function addStatsAggregationInput({
	fieldType = GraphQLString, // What guillotine uses
	glue
}: {
	fieldType?: GraphQL.ArgsType
	glue: Glue
}) {
	return glue.addInputType({
		name: GQL_INPUT_TYPE_AGGREGATION_STATS,
		description: 'Stats aggregation input type',
		fields: {
			field: {
				type: nonNull(fieldType)
			}
		}
	});
}
