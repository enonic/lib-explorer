import type {Glue} from '/lib/explorer/interface/graphql/utils/Glue';


// @ts-expect-error No types yet
import {GraphQLString} from '/lib/graphql';
import {GQL_INPUT_TYPE_DATE_RANGE} from '/lib/explorer/interface/graphql/aggregations/guillotine/constants';


export function addDateRangeInput({
	glue
}: {
	glue: Glue
}) {
	return glue.addInputType({
		name: GQL_INPUT_TYPE_DATE_RANGE,
		description: 'Number range input type',
		fields: {
			from: {
				type: GraphQLString
			},
			to: {
				type: GraphQLString
			}
		}
	});
}
