import type {RequiredNodeProperties} from '../types.d';


export interface Field {
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

export type Fields = Field[];

export interface FieldsObject {
	[name :string] :Required<Omit<Field, 'name'>>
}


export interface DocumentTypeNode extends RequiredNodeProperties {
	addFields :boolean
	properties :Fields
	//createdTime? :Date | string
	//modifiedTime? :string
}
