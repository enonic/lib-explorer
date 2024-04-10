import type {Glue} from '/lib/explorer/interface/graphql/utils/Glue';


// @ts-expect-error No types yet
import {GraphQLString} from '/lib/graphql';
import {GQL_INPUT_TYPE_GEO_POINT} from '/lib/explorer/interface/graphql/aggregations/guillotine/constants';


export function addGeoPointInput({
	glue
}: {
	glue: Glue
}) {
	return glue.addInputType({
		name: GQL_INPUT_TYPE_GEO_POINT,
		description: 'GeoPoint range input type',
		fields: {
			lat: {
				type: GraphQLString
			},
			lon: {
				type: GraphQLString
			}
		}
	});
}
