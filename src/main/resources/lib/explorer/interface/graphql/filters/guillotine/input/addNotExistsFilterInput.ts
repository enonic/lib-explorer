import type {GraphQL} from '/lib/explorer/interface/graphql/index.d';
import type {Glue} from '/lib/explorer/interface/graphql/utils/Glue';


import {
	GraphQLString,
	nonNull
	//@ts-ignore
} from '/lib/graphql';
import {GQL_INPUT_TYPE_FILTER_NOT_EXISTS} from '/lib/explorer/interface/graphql/filters/guillotine/constants';


export function addNotExistsFilterInput({
	fieldType = GraphQLString, // What guillotine uses
	glue
} :{
	fieldType ?:GraphQL.ArgsType
	glue :Glue
}) {
	return glue.addInputType({
		name: GQL_INPUT_TYPE_FILTER_NOT_EXISTS,
		description: 'NotExistsFilter input type',
		fields: {
			field: {
				type: nonNull(fieldType)
			}
		}
	});
}
