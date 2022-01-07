type ArrayLengthMutationKeys = 'splice' | 'push' | 'pop' | 'shift' | 'unshift' | number
type ArrayItems<T extends Array<any>> = T extends Array<infer TItems> ? TItems : never
type FixedLengthArray<T extends any[]> =
  Pick<T, Exclude<keyof T, ArrayLengthMutationKeys>>
  & { [Symbol.iterator]: () => IterableIterator< ArrayItems<T> > }

type GeoPointArray = FixedLengthArray<[number, number]>;
export type GeoPointFunction = (v :GeoPointArray) => unknown;
export type StringFunction = (v :string) => unknown;
export type UnknownFunction = (v :unknown) => unknown;

export interface LooseObject {
	[key :string] :unknown
}

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

export interface AddExtraFieldsToDocumentTypeParams {
	data :LooseObject
	fields :Fields
}

export interface CleanDataParameters {
	cleanExtraFields? :boolean,
	data :LooseObject,
	fieldsObj? :FieldsObject
}

export interface ValidateParameters {
	readonly data :LooseObject
	readonly fields :Field[]
	readonly validateOccurrences? :boolean
	readonly validateTypes? :boolean
	//documentType? :LooseObject
}

export interface ValidateOccurrencesParameters {
	readonly data? :LooseObject
	readonly fields? :Field[]
}

export interface ValidateTypesParameters {
	readonly data? :LooseObject
	readonly fields? :Field[]
}

export interface TypeCastToJavaParameters {
	readonly data? :LooseObject
	readonly fields? :Field[]
}

export interface CreateParameters {
	addExtraFields? :boolean
	cleanExtraFields? :boolean
	data: LooseObject
	fields :Fields
	validateOccurrences? :boolean
	validateTypes? :boolean
}

export interface CreateOptions {
	log :Log
	geoPoint :GeoPointFunction
	geoPointString :StringFunction
	instant :UnknownFunction
	localDate :UnknownFunction
	localDateTime :UnknownFunction
	localTime :UnknownFunction
	reference :StringFunction
}
