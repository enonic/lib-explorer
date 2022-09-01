import type {Glue} from '../utils/Glue';


//import {toStr} from '@enonic/js-utils';
import {
	Json as GraphQLJson,
	GraphQLFloat,
	GraphQLString,
	nonNull,
	list//,
	//reference
	//@ts-ignore
} from '/lib/graphql';


export function addObjectTypeSearchResultSynonym({glue} :{glue :Glue}) {
	return glue.addObjectType({
		name: 'SearchResultSynonym',
		fields: {
			_highlight: { type: GraphQLJson
				/*glue.addObjectType({
				name: 'SearchResultSynonymsHighlight',
				fields: {
					from: { type: list(GraphQLString) },
					to: { type: list(GraphQLString) } // Only when expand = true
				}
			})*/},
			_score: { type: GraphQLFloat },
			//from: { type: nonNull(list(GraphQLString)) },
			synonyms: {
				type: list(glue.addObjectType({
					name: 'SearchResultSynonymSynonym',
					fields: {
						locale: { type: nonNull(GraphQLString) },
						synonym: { type: nonNull(GraphQLString) }
					}
				}))
			},
			thesaurusName: { type: nonNull(GraphQLString) },
			//to: { type: nonNull(list(GraphQLString)) }
		}
	});
}
