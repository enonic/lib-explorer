import type {Glue} from '../utils/Glue';


import {
	GraphQLInt,
	GraphQLString,
	list,
	//@ts-ignore
} from '/lib/graphql';

// Input
import {addAggregationInput} from '/lib/explorer/interface/graphql/aggregations/guillotine/input/addAggregationInput';
import {addFilterInput} from '/lib/explorer/interface/graphql/filters/guillotine/input/addFilterInput';
import {addInputTypeHighlight} from '/lib/explorer/interface/graphql/highlight/input/addInputTypeHighlight';
import {addInputTypeSort} from '/lib/explorer/interface/graphql/input/addInputTypeSort';

// Output
import {searchResolver} from '/lib/explorer/interface/graphql/output/searchResolver';
import {addObjectTypeProfiling} from '/lib/explorer/interface/graphql/output/addObjectTypeProfiling';
import {addObjectTypeSearchResult} from '/lib/explorer/interface/graphql/output/addObjectTypeSearchResult';
import {addObjectTypeSearchResultSynonym} from '/lib/explorer/interface/graphql/output/addObjectTypeSearchResultSynonym';


export function addObjectTypeQuerySynonymsResult({glue} :{glue :Glue}) {
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
				args: {
					aggregations: list(addAggregationInput({glue})),
					count: GraphQLInt,
					filters: list(addFilterInput({glue})),
					highlight: addInputTypeHighlight({glue}),
					sort: list(addInputTypeSort({glue})),
					start: GraphQLInt,
				},
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
