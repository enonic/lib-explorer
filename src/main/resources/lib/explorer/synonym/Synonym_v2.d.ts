import type {CreateNodeParams} from '@enonic-types/lib-node';
import type {Reference} from '/lib/xp/value';
import type {
	ExplorerAdminGQLInterfaceNodeCommonProps,
	OneOrMore,
	RequiredNodeProperties
} from '@enonic-types/lib-explorer';
import type {HighlightResult} from '@enonic/js-utils/types/node/query/Highlight';

//──────────────────────────────────────────────────────────────────────────
// Input types
//──────────────────────────────────────────────────────────────────────────
export type InputTypeLanguageSynonym = {
	// Required
	synonym: string
	// Optional
	comment?: string
	disabledInInterfaces?: string[]
	enabled?: boolean
}

export type InputTypeSynonymLanguage = {
	// Required
	locale: string
	// Optional
	both?: InputTypeLanguageSynonym[]
	comment?: string
	disabledInInterfaces?: string[]
	enabled?: boolean
	from?: InputTypeLanguageSynonym[]
	to?: InputTypeLanguageSynonym[]
}

export type InputTypeSynonymLanguages = InputTypeSynonymLanguage[]

//──────────────────────────────────────────────────────────────────────────
// SynonymNode
//──────────────────────────────────────────────────────────────────────────
interface SynonymNode_LanguagesSynonymObject_Common {
	// Required
	synonym: string
	// Optional
	comment?: string
	enabled?: boolean
}

export interface SynonymNode_LanguagesSynonymObject extends SynonymNode_LanguagesSynonymObject_Common {
	disabledInInterfaces?: OneOrMore<string>
}

interface Write_SynonymNode_LanguagesSynonymObject extends SynonymNode_LanguagesSynonymObject_Common {
	disabledInInterfaces?: OneOrMore<Reference>
}


interface SynonymNode_Language_Common {
	// Optional
	both?: OneOrMore<SynonymNode_LanguagesSynonymObject>
	comment?: string
	enabled?: boolean
}

interface SynonymNode_Language extends SynonymNode_Language_Common {
	disabledInInterfaces?: OneOrMore<string>
	from?: OneOrMore<SynonymNode_LanguagesSynonymObject>
	to?: OneOrMore<SynonymNode_LanguagesSynonymObject>
}

interface Write_SynonymNode_Language extends SynonymNode_Language_Common {
	disabledInInterfaces?: OneOrMore<Reference>
	from?: OneOrMore<Write_SynonymNode_LanguagesSynonymObject>
	to?: OneOrMore<Write_SynonymNode_LanguagesSynonymObject>
}

// In order to be able to:
// * use stemming
// * search a specific language
// the locale (languageCode_countryCode) must be part of the field path.
// Thus on the node layer, languages must be a record, not an array.
export type SynonymNode_Languages = Record<string,SynonymNode_Language>
type Write_SynonymNode_Languages = Record<string,Write_SynonymNode_Language>

type SynonymNode_Common = {
	// Required
	nodeTypeVersion: number // TODO Make common across "all" nodeTypes?
	//thesaurus: string // Not stored on the SynonymNode
	// Optional
	comment?: string
	createdTime?: Date | string
	creator?: string
	enabled?: boolean
	modifiedTime?: Date | string
	modifier?: string
}

export type SynonymNode = RequiredNodeProperties & SynonymNode_Common & {
	disabledInInterfaces?: OneOrMore<string>
	languages?: SynonymNode_Languages
	thesaurusReference: string
};

export type SynonymNodeCreateParams = CreateNodeParams<SynonymNode_Common & {
	disabledInInterfaces?: OneOrMore<Reference>
	languages?: Write_SynonymNode_Languages
	thesaurusReference: Reference
}>;

export type SynonymNodeModifyParams = RequiredNodeProperties & SynonymNode_Common & {
	disabledInInterfaces?: OneOrMore<Reference>
	languages?: Write_SynonymNode_Languages
	thesaurusReference: Reference
};

//──────────────────────────────────────────────────────────────────────────
// Synonym (Model)
//──────────────────────────────────────────────────────────────────────────
export type Synonym_LanguagesSynonymObject = {
	// Required
	comment: string
	disabledInInterfaces: string[]
	enabled: boolean
	synonym: string
}

//export type Synonym_LanguagesSynonymObjects = Array<Synonym_LanguagesSynonymObject>

type Synonym_Language = {
	// Required
	both: Array<Synonym_LanguagesSynonymObject>
	comment: string
	disabledInInterfaces: string[]
	enabled: boolean
	locale: string
	from: Array<Synonym_LanguagesSynonymObject>
	to: Array<Synonym_LanguagesSynonymObject>
}

type Synonym_Common = {
	// Required
	comment: string
	enabled: boolean
	disabledInInterfaces: string[]
	languages: Array<Synonym_Language>
}

type Synonym_Specific = Synonym_Common & {
	// Required
	thesaurus: string // Gotten from thesaurusReference
	thesaurusReference: string
}


export type Synonym = ExplorerAdminGQLInterfaceNodeCommonProps<Synonym_Specific & {
	_nodeTypeVersion: number
}>

export type QueriedSynonym = Synonym & {
	_highlight: HighlightResult
	_score: number
}

//──────────────────────────────────────────────────────────────────────────
// Synonym (GUI)
//──────────────────────────────────────────────────────────────────────────
export type SynonymUse = 'both'|'from'|'to'

export type SynonymGUI_LanguagesSynonymObject = Synonym_LanguagesSynonymObject & {
	use: SynonymUse
}

export type SynonymGUI_Language = {
	// Required
	comment: string
	disabledInInterfaces: Array<string>
	enabled: boolean
	locale: string
	synonyms: Array<SynonymGUI_LanguagesSynonymObject>
}

export type SynonymGUI = {
	// Required
	comment: string
	enabled: boolean
	disabledInInterfaces: Array<string>
	languages: Array<SynonymGUI_Language>
}

/*
//@ts-ignore Initializers are not allowed in ambient contexts.
const EXAMPLE_SYNONYM_NODE: SynonymNode = {
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
const EXAMPLE_SYNONYM_OBJECT: Synonym = {
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
