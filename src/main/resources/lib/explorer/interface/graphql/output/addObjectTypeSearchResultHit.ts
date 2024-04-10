import type {Glue} from '/lib/explorer/interface/graphql/utils/Glue';


import {addOutputFieldsSearchResultHit} from './addOutputFieldsSearchResultHit';


export function addObjectTypeSearchResultHit({glue} :{glue :Glue}) {
	return glue.addObjectType({
		name: 'SearchResultHit',
		fields: addOutputFieldsSearchResultHit({glue})
	});
}
