import type {GraphQL} from '../../../index.d';
import type {Glue} from '../../../utils/Glue';


import {
	GraphQLString,
	list,
	nonNull
	// @ts-expect-error No types yet
} from '/lib/graphql';
import {
	GQL_INPUT_TYPE_AGGREGATION_RANGE,
	GQL_INPUT_TYPE_NUMBER_RANGE
} from '../constants';


export function addRangeAggregationInput({
	fieldType = GraphQLString, // What guillotine uses
	glue
}: {
	fieldType?: GraphQL.ArgsType
	glue: Glue
}) {
	return glue.addInputType({
		name: GQL_INPUT_TYPE_AGGREGATION_RANGE,
		description: 'Range aggregation input type',
		fields: {
			field: {
				type: nonNull(fieldType)
			},
			ranges: {
				type: list(glue.getInputType(GQL_INPUT_TYPE_NUMBER_RANGE))
			}
		}
	});
}
