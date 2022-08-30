import type {Glue} from '../utils/Glue';


import {toStr} from '@enonic/js-utils';
import {
	Json as GraphQLJson,
	GraphQLFloat,
	GraphQLInt,
	GraphQLString,
	nonNull,
	list//,
	//reference
	//@ts-ignore
} from '/lib/graphql';
import {GQL_INTERFACE_TYPE_DOCUMENT} from './constants';


export function addObjectTypeSearchResult({glue} :{glue :Glue}) {
	return glue.addObjectType({
		name: 'SearchResult',
		fields: {
			aggregationsAsJson: { type: GraphQLJson },
			count: { type: nonNull(GraphQLInt) },
			hits: { type: list(glue.getInterfaceType(GQL_INTERFACE_TYPE_DOCUMENT)) },
			//hits: { type: list(addObjectTypeSearchResultHit({glue})) },
			//search: { type: reference('search') },
			/*search: {
				//args
				resolve(env) {
					log.debug('env:%s', toStr(env));
					return {
						aggregationsAsJson: {}
					}
				},
				type: glue.addObjectType({
					name: 'SearchResultSynonymsSearch',
					fields: {
						aggregationsAsJson: { type: GraphQLJson }
					}
				})
			},*/
			start: { type: nonNull(GraphQLInt) }, // Used in search connection
			synonyms: { type: list(glue.addObjectType({
				name: 'SearchResultSynonyms',
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
							name: 'SearchResultSynonym',
							fields: {
								locale: { type: nonNull(GraphQLString) },
								synonym: { type: nonNull(GraphQLString) }
							}
						}))
					},
					thesaurusName: { type: nonNull(GraphQLString) },
					//to: { type: nonNull(list(GraphQLString)) }
				}
			}))},
			total: { type: nonNull(GraphQLInt) }
		}
	});
}
