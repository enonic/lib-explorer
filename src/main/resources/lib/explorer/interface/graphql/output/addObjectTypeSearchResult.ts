import type {Glue} from '/lib/explorer/interface/graphql/utils/Glue';


//import {toStr} from '@enonic/js-utils';
import {
	Json as GraphQLJson,
	GraphQLInt,
	nonNull,
	list//,
	//reference
	//@ts-ignore
} from '/lib/graphql';
import {GQL_INTERFACE_TYPE_DOCUMENT} from './constants';
import {addObjectTypeProfiling} from '/lib/explorer/interface/graphql/output/addObjectTypeProfiling';
import {addObjectTypeSearchResultSynonym} from '/lib/explorer/interface/graphql/output/addObjectTypeSearchResultSynonym';


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
			profiling: {
				type: list(addObjectTypeProfiling({glue}))
			},
			start: { type: nonNull(GraphQLInt) }, // Used in search connection
			synonyms: { type: list(addObjectTypeSearchResultSynonym({glue}))},
			total: { type: nonNull(GraphQLInt) }
		}
	});
}
