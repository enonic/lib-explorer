import type {GraphQL} from '/lib/explorer/interface/graphql/index.d';
import type {Glue} from '/lib/explorer/interface/graphql/utils/Glue';


import {
	GraphQLString,
	list
	//@ts-ignore
} from '/lib/graphql';
import {GQL_INPUT_TYPE_FILTER_IDS} from '/lib/explorer/interface/graphql/filters/guillotine/constants';


export function addIdsFilterInput({
	fieldType = GraphQLString, // What guillotine uses
	glue
} :{
	fieldType ?:GraphQL.ArgsType
	glue :Glue
}) {
	return glue.addInputType({
		name: GQL_INPUT_TYPE_FILTER_IDS,
		description: 'IdsFilter input type',
		fields: {
			values: {
				type: list(fieldType)
			}
		}
	});
}
