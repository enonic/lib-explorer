import type {
	Highlight as LibNodeHighlight
} from '/lib/xp/node';


interface CommonHighlightOptions {
	fragmenter?: LibNodeHighlight['fragmenter']
	fragmentSize?: LibNodeHighlight['fragmentSize']
	noMatchSize?: LibNodeHighlight['noMatchSize']
	numberOfFragments?: LibNodeHighlight['numberOfFragments']
	order?: LibNodeHighlight['order']
	postTag?: LibNodeHighlight['postTag']
	preTag?: LibNodeHighlight['preTag']
	requireFieldMatch?: LibNodeHighlight['requireFieldMatch']
}

export type Highlight = CommonHighlightOptions & {
	encoder?: LibNodeHighlight['encoder']
	fields: CommonHighlightOptions & {
		field: string
	}[]
	tagsSchema?: LibNodeHighlight['tagsSchema']
}
