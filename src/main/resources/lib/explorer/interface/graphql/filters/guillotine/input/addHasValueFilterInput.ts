import type {GraphQL} from '/lib/explorer/interface/graphql/index.d';
import type {Glue} from '/lib/explorer/interface/graphql/utils/Glue';


import {
	GraphQLBoolean,
	GraphQLFloat,
	GraphQLInt,
	GraphQLString,
	list,
	nonNull
	//@ts-ignore
} from '/lib/graphql';
import {GQL_INPUT_TYPE_FILTER_HAS_VALUE} from '/lib/explorer/interface/graphql/filters/guillotine/constants';


export function addHasValueFilterInput({
	fieldType = GraphQLString, // What guillotine uses
	glue
} :{
	fieldType ?:GraphQL.ArgsType
	glue :Glue
}) {
	return glue.addInputType({
		name: GQL_INPUT_TYPE_FILTER_HAS_VALUE,
		description: 'HasValueFilter input type',
		fields: {
			field: {
				type: nonNull(fieldType)
			},
			stringValues: {
				type: list(GraphQLString)
			},
			intValues: {
				type: list(GraphQLInt)
			},
			floatValues: {
				type: list(GraphQLFloat)
			},
			booleanValues: {
				type: list(GraphQLBoolean)
			}
		}
	});
}
