import type {Glue} from '/lib/explorer/interface/graphql/utils/Glue';


import {HIGHLIGHT_OPTION_ENCODERS} from '@enonic/js-utils';
import {GQL_ENUM_HIGHLIGHT_OPTION_ENCODERS} from './constants';


export function addEnumHighlightOptionEncoders({glue} :{glue :Glue}) {
	return glue.addEnumType({
		name: GQL_ENUM_HIGHLIGHT_OPTION_ENCODERS,
		values: HIGHLIGHT_OPTION_ENCODERS
	});
}
