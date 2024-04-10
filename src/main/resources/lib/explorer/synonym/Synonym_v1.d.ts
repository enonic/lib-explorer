import type {
	NodeCreate,
	OneOrMore,
	RequiredNodeProperties
} from '@enonic-types/lib-explorer';


export interface SynonymSpecific {
	from :OneOrMore<string>
	//thesaurus :string
	thesaurusReference :string
	to :OneOrMore<string>
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
		[name: string]: Array<string>;
	}
	_score :number
	thesaurus :string
}
