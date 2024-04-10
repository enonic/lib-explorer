import type {GraphQL} from '/lib/explorer/interface/graphql/index.d';
import type {Glue} from '/lib/explorer/interface/graphql/utils/Glue';


import {
	GraphQLString,
	list,
	nonNull
	// @ts-expect-error No types yet
} from '/lib/graphql';
import { addEnumTypeGeoDistanceUnit } from '/lib/explorer/interface/graphql/input/addEnumTypeGeoDistanceUnit';
import {
	GQL_INPUT_TYPE_AGGREGATION_DATE_HISTOGRAM,
	GQL_INPUT_TYPE_GEO_POINT,
	GQL_INPUT_TYPE_NUMBER_RANGE
} from '/lib/explorer/interface/graphql/aggregations/guillotine/constants';


export function addGeoDistanceAggregationInput({
	fieldType = GraphQLString, // What guillotine uses
	glue
}: {
	fieldType?: GraphQL.ArgsType
	glue: Glue
}) {
	return glue.addInputType({
		name: GQL_INPUT_TYPE_AGGREGATION_DATE_HISTOGRAM,
		description: 'GeoDistance aggregation input type',
		fields: {
			field: {
				type: nonNull(fieldType)
			},
			unit: {
				type: addEnumTypeGeoDistanceUnit({glue}),
			},
			origin: {
				type: glue.getInputType(GQL_INPUT_TYPE_GEO_POINT)
			},
			ranges: {
				type: list(glue.getInputType(GQL_INPUT_TYPE_NUMBER_RANGE))
			}
		}
	});
}
