import type {HighlightResult} from '@enonic/js-utils/types/node/query/Highlight';
import type {
	SynonymNode,
	QueriedSynonym
} from '/lib/explorer/types/index.d';


import {moldSynonymNode} from '/lib/explorer/synonym/moldSynonymNode';


export function moldQueriedSynonymNode({
	_highlight = {},
	_score = 0,
	...rest
}: SynonymNode & {
	_highlight?: HighlightResult
	_score?: number
}): QueriedSynonym {
	return {
		...moldSynonymNode(rest),
		_highlight,
		_score
	};
}
