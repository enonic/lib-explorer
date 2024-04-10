import type {Glue} from '/lib/explorer/interface/graphql/utils/Glue';


import {
	GraphQLFloat,
	GraphQLString,
	nonNull
	//@ts-ignore
} from '/lib/graphql';


export function addObjectTypeProfiling({glue} :{glue :Glue}) {
	return glue.addObjectType({
		name: 'Profiling',
		fields: {
			currentTimeMillis: { type: nonNull(GraphQLFloat) },
			label: { type: nonNull(GraphQLString) },
			operation: { type: nonNull(GraphQLString) }
		},
	})
}
