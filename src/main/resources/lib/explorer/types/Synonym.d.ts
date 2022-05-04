import type {
	OneOrMore,
	RequiredNodeProperties
} from '/lib/explorer/types/index.d';


export interface SynonymSpecific {
	from :OneOrMore<string>
	to :OneOrMore<string>
	//displayName? :string
	thesaurus :string
	thesaurusReference :string
}

export type SynonymNode = RequiredNodeProperties & SynonymSpecific;

export type Synonym = Omit<
	RequiredNodeProperties,
	'_childOrder'
		| '_indexConfig'
		| '_inheritsPermissions'
		| '_name' // Name is random and useless...
		| '_nodeType'
		| '_permissions'
		| '_state'
		| '_ts'
		| '_versionKey'
> & Omit<SynonymSpecific, 'from'|'to'> & {
	from :Array<string>
	to :Array<string>
}

export interface QueriedSynonym extends Synonym {
	_highlight? :{
		[name: string]: ReadonlyArray<string>;
	  }
	_score :number
}
