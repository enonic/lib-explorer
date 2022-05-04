import type {RequiredNodeProperties} from '../types.d';


export interface DocumentTypeField {
	active? :boolean // From GUI
	enabled? :boolean
	fulltext? :boolean
	includeInAllText? :boolean
	max? :number
	min? :number
	name :string
	nGram? :boolean
	path? :boolean
	valueType? :string
}

export type DocumentTypeFields = DocumentTypeField[];

export interface DocumentTypeFieldsObject {
	[name :string] :Required<Omit<DocumentTypeField, 'name'>>
}

export interface DocumentTypeNode extends RequiredNodeProperties {
	addFields :boolean
	properties :DocumentTypeFields
	//createdTime? :Date | string
	//modifiedTime? :string
}
