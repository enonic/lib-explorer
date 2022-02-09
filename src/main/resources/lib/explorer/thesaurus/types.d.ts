import type {RequiredNodeProperties} from '/lib/explorer-typescript/types.d';


export interface ThesaurusSpecific {
	description? :string
	language? :string
}

export type ThesaurusNode = RequiredNodeProperties & ThesaurusSpecific;

export type Thesaurus = Omit<
	RequiredNodeProperties,
	'_childOrder'
		| '_indexConfig'
		| '_inheritsPermissions'
		| '_nodeType'
		| '_permissions'
		| '_state'
		| '_ts'
		| '_versionKey'
> & ThesaurusSpecific & {
	id :string // backwards compatibility
	name :string // backwards compatibility
	synonymsCount? :number
}
