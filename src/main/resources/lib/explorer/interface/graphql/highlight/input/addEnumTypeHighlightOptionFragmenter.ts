import type {Glue} from '/lib/explorer/interface/graphql/utils/Glue';


import {GQL_ENUM_HIGHLIGHT_OPTION_FRAGMENTERS} from './constants';


export function addEnumTypeHighlightOptionFragmenter({glue} :{glue :Glue}) {
	return glue.addEnumType({
		name: GQL_ENUM_HIGHLIGHT_OPTION_FRAGMENTERS,
		values: [
			'simple',
			'span' // default
		]
	});
}
