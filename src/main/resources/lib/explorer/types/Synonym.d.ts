import type {
	NodeCreate,
	OneOrMore,
	RequiredNodeProperties
} from '/lib/explorer/types/index.d';


export interface SynonymSpecific {
	from :OneOrMore<string>
	to :OneOrMore<string>
	//thesaurus :string
	thesaurusReference :string
}

export type SynonymNode = RequiredNodeProperties & SynonymSpecific;
export type SynonymNodeCreateParams = NodeCreate<SynonymSpecific>;

export type Synonym = Omit<
	RequiredNodeProperties,
	'_childOrder'
		| '_indexConfig'
		| '_inheritsPermissions'
		//| '_name' // GraphQL Interface Node needs this
		//| '_nodeType' // GraphQL Interface Node needs this
		| '_permissions'
		| '_state'
		| '_ts'
		//| '_versionKey' // GraphQL Interface Node needs this
> & Omit<SynonymSpecific, 'from'|'to'> & {
	from :Array<string>
	to :Array<string>
}

export interface QueriedSynonym extends Synonym {
	_highlight? :{
		[name: string]: ReadonlyArray<string>;
	  }
	_score :number
	thesaurus :string
}
