import type {Glue} from '/lib/explorer/interface/graphql/utils/Glue';


// @ts-expect-error No types yet
import {GraphQLFloat} from '/lib/graphql';
import {GQL_INPUT_TYPE_NUMBER_RANGE} from '/lib/explorer/interface/graphql/aggregations/guillotine/constants';


export function addNumberRangeInput({
	glue
}: {
	glue: Glue
}) {
	return glue.addInputType({
		name: GQL_INPUT_TYPE_NUMBER_RANGE,
		description: 'Number range input type',
		fields: {
			from: {
				type: GraphQLFloat
			},
			to: {
				type: GraphQLFloat
			}
		}
	});
}
