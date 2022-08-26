import type {HighlightResult} from '@enonic/js-utils/src/types/node/index.d';


export type SynonymsArrayItem = {
	_highlight :HighlightResult
	_score :number
	//from : Array<string>
	synonyms: {
		locale :string
		synonym :string
	}[]
	thesaurusName :string
	//to : Array<string>
}

export type SynonymsArray = Array<SynonymsArrayItem>
