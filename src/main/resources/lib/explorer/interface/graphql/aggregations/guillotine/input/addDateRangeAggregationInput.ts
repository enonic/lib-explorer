import type {GraphQL} from '/lib/explorer/interface/graphql/index.d';
import type {Glue} from '/lib/explorer/interface/graphql/utils/Glue';


import {
	GraphQLString,
	list,
	nonNull
	// @ts-expect-error No types yet
} from '/lib/graphql';
import {
	GQL_INPUT_TYPE_AGGREGATION_DATE_RANGE,
	GQL_INPUT_TYPE_DATE_RANGE
} from '/lib/explorer/interface/graphql/aggregations/guillotine/constants';


export function addDateRangeAggregationInput({
	fieldType = GraphQLString, // What guillotine uses
	glue
}: {
	fieldType?: GraphQL.ArgsType
	glue: Glue
}) {
	return glue.addInputType({
		name: GQL_INPUT_TYPE_AGGREGATION_DATE_RANGE,
		description: 'DateRange aggregation input type',
		fields: {
			field: {
				type: nonNull(fieldType)
			},
			format: {
				type: GraphQLString
			},
			ranges: {
				type: list(glue.getInputType(GQL_INPUT_TYPE_DATE_RANGE))
			}
		}
	});
}
