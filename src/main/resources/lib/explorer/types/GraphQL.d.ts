import type {
	Highlight as LibNodeHighlight
} from '/lib/xp/node';


interface GQL_InputType_CommonHighlightOptions {
	fragmenter?: LibNodeHighlight['fragmenter']
	fragmentSize?: LibNodeHighlight['fragmentSize']
	noMatchSize?: LibNodeHighlight['noMatchSize']
	numberOfFragments?: LibNodeHighlight['numberOfFragments']
	order?: LibNodeHighlight['order']
	postTag?: LibNodeHighlight['postTag']
	preTag?: LibNodeHighlight['preTag']
	requireFieldMatch?: LibNodeHighlight['requireFieldMatch']
}

export type GQL_InputType_Highlight = GQL_InputType_CommonHighlightOptions & {
	encoder?: LibNodeHighlight['encoder']
	fields: CommonHighlightOptions & {
		field: string
	}[]
	tagsSchema?: LibNodeHighlight['tagsSchema']
}
