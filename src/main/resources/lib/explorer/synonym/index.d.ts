export type SynonymsArrayItem = {
	_highlight :Record<string, ReadonlyArray<string>>
	_score :number
	from : Array<string>
	thesaurusName :string
	to : Array<string>
}

export type SynonymsArray = Array<SynonymsArrayItem>
