import type {Glue} from '/lib/explorer/interface/graphql/utils/Glue';


import {GQL_ENUM_HIGHLIGHT_OPTION_ORDERS} from './constants';


export function addEnumTypeHighlightOptionOrder({glue} :{glue :Glue}) {
	return glue.addEnumType({
		name: GQL_ENUM_HIGHLIGHT_OPTION_ORDERS,
		values: [
			'none',  // default
			'score'
		]
	});
}
