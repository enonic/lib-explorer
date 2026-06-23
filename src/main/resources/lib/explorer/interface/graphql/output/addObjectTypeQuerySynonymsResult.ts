import type { Glue } from '/lib/explorer/interface/graphql/utils/Glue';


import {
	GraphQLString,
	list,
	// @ts-ignore No types yet.
} from '/lib/graphql';

// Output
import { searchResolver } from '/lib/explorer/interface/graphql/output/searchResolver';
import { addObjectTypeProfiling } from '/lib/explorer/interface/graphql/output/addObjectTypeProfiling';
import { addObjectTypeSearchResult } from '/lib/explorer/interface/graphql/output/addObjectTypeSearchResult';
import { addObjectTypeSearchResultSynonym } from '/lib/explorer/interface/graphql/output/addObjectTypeSearchResultSynonym';
import { getSearchArgs } from './getSearchArgs';


export function addObjectTypeQuerySynonymsResult({ glue }: { glue: Glue; }) {
	return glue.addObjectType({
		name: 'QuerySynonymsResult',
		fields: {
			languages: {
				type: list(GraphQLString)
			},
			profiling: {
				type: list(addObjectTypeProfiling({glue}))
			},
			search: {
				args: getSearchArgs({ glue }),
				resolve: searchResolver,
				type: addObjectTypeSearchResult({glue})
			},
			/*searchString: {
				type: GraphQLString
			},*/
			synonyms: {
				type: list(addObjectTypeSearchResultSynonym({glue}))
			}
		}
	});
}
