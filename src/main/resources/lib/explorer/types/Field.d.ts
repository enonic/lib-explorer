export interface Field {
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

export type Fields = Field[];

export interface FieldsObject {
	[name :string] :Required<Omit<Field, 'name'>>
}
