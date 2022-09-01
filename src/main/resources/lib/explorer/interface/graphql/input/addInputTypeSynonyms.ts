import type {Glue} from '../utils/Glue';


import {
	GraphQLString,
	nonNull
	//@ts-ignore
} from '/lib/graphql';
import {GQL_INPUT_TYPE_SYNOYMS} from './constants';


export function addInputTypeSynonyms({
	glue
} :{
	glue :Glue
}) {
	return glue.addInputType({
		name: GQL_INPUT_TYPE_SYNOYMS,
		fields: {
			locale: { type: nonNull(GraphQLString) },
			synonym: { type: nonNull(GraphQLString) }
		}
	});
}
