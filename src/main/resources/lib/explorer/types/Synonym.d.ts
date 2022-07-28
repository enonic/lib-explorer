import type {
	NodeCreate,
	OneOrMore,
	RequiredNodeProperties
} from '/lib/explorer/types/index.d';

export type SynonymUse = 'from'|'to'|'both'; // default is to

export type SynonymLanguagesSynonymObject<Type extends 'Array'|'OneOrMore'= 'Array'> = {
	comment ?:string
	disabledInInterfaces ?:Type extends 'Array' ? Array<string> : OneOrMore<string>
	enabled ?:boolean
	synonym :string
	use ?:SynonymUse
}

export type SynonymLanguage<Type extends 'Array'|'OneOrMore'= 'Array'> = {
	comment ?:string
	enabled ?:boolean
	disabledInInterfaces ?:Type extends 'Array' ? Array<string> : OneOrMore<string>
	synonyms :Type extends 'Array'
		? Array<SynonymLanguagesSynonymObject<'Array'>>
		: OneOrMore<SynonymLanguagesSynonymObject<'OneOrMore'>>
}

export type SynonymLanguages<
	Type extends 'Array'|'OneOrMore'= 'Array'
> = Record<string,SynonymLanguage<Type>>

export type SynonymSpecific<Type extends 'Array'|'OneOrMore'= 'Array'> = {
	comment ?:string
	enabled ?:boolean
	disabledInInterfaces ?:Type extends 'Array' ? Array<string> : OneOrMore<string>
	//from :Type extends 'Array' ? Array<string> : OneOrMore<string>
	languages ?:SynonymLanguages
	//to :Type extends 'Array' ? Array<string> : OneOrMore<string>
	//thesaurus :string
	thesaurusReference :string
}

export type SynonymGUIState = Omit<SynonymSpecific<'Array'>,'thesaurusReference'>

export type SynonymNode = RequiredNodeProperties & SynonymSpecific<'OneOrMore'>;
export type SynonymNodeCreateParams = NodeCreate<SynonymSpecific<'Array'>>;

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
> & SynonymSpecific<'OneOrMore'>

export type QueriedSynonym = Synonym & {
	_highlight ?:{
		[name: string]: ReadonlyArray<string>;
	}
	_score :number
	thesaurus :string
}
