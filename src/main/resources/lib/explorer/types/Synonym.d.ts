import type {
	ExplorerAdminGQLInterfaceNodeCommonProps,
	NodeCreate,
	OneOrMore,
	RequiredNodeProperties
} from '/lib/explorer/types/index.d';
import type {HighlightResult} from '@enonic/js-utils/src/types/node/query/Highlight';

//──────────────────────────────────────────────────────────────────────────
// Input types
//──────────────────────────────────────────────────────────────────────────
export type InputTypeLanguageSynonym = {
	// Required
	synonym :string
	// Optional
	comment ?:string
	disabledInInterfaces ?:Array<string>
	enabled ?:boolean
}

export type InputTypeSynonymLanguage = {
	// Required
	locale :string
	// Optional
	both ?:Array<InputTypeLanguageSynonym>
	comment ?:string
	disabledInInterfaces ?:Array<string>
	enabled ?:boolean
	from ?:Array<InputTypeLanguageSynonym>
	to ?:Array<InputTypeLanguageSynonym>
}

export type InputTypeSynonymLanguages = Array<InputTypeSynonymLanguage>

//──────────────────────────────────────────────────────────────────────────
// SynonymNode
//──────────────────────────────────────────────────────────────────────────
export type SynonymNode_LanguagesSynonymObject = {
	// Required
	synonym :string
	// Optional
	comment ?:string
	disabledInInterfaces ?:OneOrMore<string>
	enabled ?:boolean
}

type SynonymNode_Language = {
	// Optional
	both ?:OneOrMore<SynonymNode_LanguagesSynonymObject>
	comment ?:string
	disabledInInterfaces ?:OneOrMore<string>
	enabled ?:boolean
	from ?:OneOrMore<SynonymNode_LanguagesSynonymObject>
	to ?:OneOrMore<SynonymNode_LanguagesSynonymObject>
}

// In order to be able to:
// * use stemming
// * search a specific language
// the locale (languageCode_countryCode) must be part of the field path.
// Thus on the node layer, languages must be a record, not an array.
export type SynonymNode_Languages = Record<string,SynonymNode_Language>

type SynonymNode_Specific = {
	// Required
	//thesaurus :string // Not stored on the SynonymNode
	thesaurusReference :string
	// Optional
	comment ?:string
	enabled ?:boolean
	disabledInInterfaces ?:OneOrMore<string>
	languages ?:SynonymNode_Languages
}

export type SynonymNode = RequiredNodeProperties & SynonymNode_Specific;

export type SynonymNodeCreateParams = NodeCreate<SynonymNode_Specific>;

//──────────────────────────────────────────────────────────────────────────
// Synonym (Model)
//──────────────────────────────────────────────────────────────────────────
export type Synonym_LanguagesSynonymObject = {
	// Required
	comment :string
	disabledInInterfaces :Array<string>
	enabled :boolean
	synonym :string
}

//export type Synonym_LanguagesSynonymObjects = Array<Synonym_LanguagesSynonymObject>

type Synonym_Language = {
	// Required
	both :Array<Synonym_LanguagesSynonymObject>
	comment :string
	disabledInInterfaces :Array<string>
	enabled :boolean
	locale :string
	from :Array<Synonym_LanguagesSynonymObject>
	to :Array<Synonym_LanguagesSynonymObject>
}

type Synonym_Common = {
	// Required
	comment :string
	enabled :boolean
	disabledInInterfaces :Array<string>
	languages :Array<Synonym_Language>
}

type Synonym_Specific = Synonym_Common & {
	// Required
	thesaurus :string // Gotten from thesaurusReference
	thesaurusReference :string
}


export type Synonym = ExplorerAdminGQLInterfaceNodeCommonProps<Synonym_Specific>

export type QueriedSynonym = Synonym & {
	_highlight :HighlightResult
	_score :number
}

//──────────────────────────────────────────────────────────────────────────
// Synonym (GUI)
//──────────────────────────────────────────────────────────────────────────
export type SynonymUse = 'both'|'from'|'to'

export type SynonymGUI_LanguagesSynonymObject = Synonym_LanguagesSynonymObject & {
	use :SynonymUse
}

export type SynonymGUI_Language = {
	// Required
	comment :string
	disabledInInterfaces :Array<string>
	enabled :boolean
	locale :string
	synonyms :Array<SynonymGUI_LanguagesSynonymObject>
}

export type SynonymGUI = {
	// Required
	comment :string
	enabled :boolean
	disabledInInterfaces :Array<string>
	languages :Array<SynonymGUI_Language>
}

/*
//@ts-ignore Initializers are not allowed in ambient contexts.
const EXAMPLE_SYNONYM_NODE :SynonymNode = {
	//_childOrder: '...',
	//_id: '...',
	//_indexConfig: {},
	//_inheritsPermissions: false,
	//_name: '...',
	//_path: '...',
	//_permissions,
	//_nodeType: '...',
	//_state
	//_ts
	//_versionKey: '...',
	//comment: '',
	//disabledInInterfaces: [],
	//enabled: true,
	languages: {
		'zxx': {
			//comment: '',
			//disabledInInterfaces: [],
			//enabled: true,
			from: {
				//comment: '',
				//disabledInInterfaces: [],
				//enabled: true,
				synonym: 'A01AA02'
			},
		}
	},
	thesaurusReference: '...'
}

//@ts-ignore Initializers are not allowed in ambient contexts.
const EXAMPLE_SYNONYM_OBJECT :Synonym = {
	//_id: '...',
	//_name: '...',
	//_path: '...',
	//_nodeType: '...',
	//_versionKey: '...',
	//comment: '',
	//disabledInInterfaces: [],
	//enabled: true,
	languages: [{
		//comment: '',
		//disabledInInterfaces: [],
		//enabled: true,
		both: [],
		from: [{
			//comment: '',
			//disabledInInterfaces: [],
			//enabled: true,
			synonym: 'A01AA02'
		}],
		locale: 'zxx',
		to: []
	}],
	//thesaurus: '...'
	//thesaurusReference: '...'
}
*/
