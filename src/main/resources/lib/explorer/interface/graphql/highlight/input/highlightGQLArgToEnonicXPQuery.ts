import type { Highlight } from '/lib/xp/node';
import type { GQL_InputType_Highlight } from '@enonic-types/lib-explorer';

// import {toStr} from '@enonic/js-utils';


type HighlightKeys = keyof Highlight;
type GQL_InputType_HighlightKeys = keyof GQL_InputType_Highlight;


export function highlightGQLArgToEnonicXPQuery({
	highlightArg,
}: {
	highlightArg: GQL_InputType_Highlight
}): Highlight {
	// log.debug('highlightGQLArgToEnonicXPQuery highlightArg:%s', toStr(highlightArg));
	const highlight: Highlight = {};
	const keys = Object.keys(highlightArg) as GQL_InputType_HighlightKeys[];
	for (let i = 0; i < keys.length; i++) {
		const key = keys[i];
		// log.debug('highlightGQLArgToEnonicXPQuery i:%s key:%s', i, key);
		if (key === 'fields') {
			if (!highlight.properties) {
				highlight.properties = {};
			}
			for (let j = 0; j < highlightArg.fields.length; j++) {
				// log.debug('highlightGQLArgToEnonicXPQuery highlightArg.properties[%s]:%s', j, toStr(highlightArg.properties[j]));
				const {field, ...rest} = highlightArg.fields[j];
				highlight.properties[field] = rest;
			}
		} else {
			// Typechecking doesn't fail in IDE, but during compile.
			// @ts-ignore Value type depends on key.
			highlight[key as HighlightKeys] = highlightArg[key as GQL_InputType_HighlightKeys];
		}
	}
	return highlight;
}
