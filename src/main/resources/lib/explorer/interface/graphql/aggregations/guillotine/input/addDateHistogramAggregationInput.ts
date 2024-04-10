import type {GraphQL} from '/lib/explorer/interface/graphql/index.d';
import type {Glue} from '/lib/explorer/interface/graphql/utils/Glue';


import {
	GraphQLInt,
	GraphQLString,
	nonNull
	// @ts-expect-error No types yet
} from '/lib/graphql';
import {
	GQL_INPUT_TYPE_AGGREGATION_GEO_DISTANCE
} from '/lib/explorer/interface/graphql/aggregations/guillotine/constants';


export function addDateHistogramAggregationInput({
	fieldType = GraphQLString, // What guillotine uses
	glue
}: {
	fieldType?: GraphQL.ArgsType
	glue: Glue
}) {
	return glue.addInputType({
		name: GQL_INPUT_TYPE_AGGREGATION_GEO_DISTANCE,
		description: 'DateHistogram aggregation input type',
		fields: {
			field: {
				type: nonNull(fieldType)
			},
			interval: {
				type: GraphQLString
			},
			format: {
				type: GraphQLString
			},
			minDocCount: {
				type: GraphQLInt
			}
		}
	});
}
