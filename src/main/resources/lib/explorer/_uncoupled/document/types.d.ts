import {
	AnyObject,
	Path,
	ParentPath
} from '../../types/index.d';

import {
	Field,
	Fields,
	FieldsObject
} from '../../types/Field.d';


export interface AddExtraFieldsToDocumentTypeParams {
	data :AnyObject
	documentTypeId :string
	fieldsObj :FieldsObject
}

export interface CleanDataParameters {
	cleanExtraFields? :boolean,
	data :AnyObject,
	fieldsObj? :FieldsObject
}

export interface ValidateParameters {
	data :AnyObject
	fieldsObj :FieldsObject
	partial? :boolean
	validateOccurrences? :boolean
	validateTypes? :boolean
	//documentType? :AnyObject
}

export interface ValidateOccurrencesParameters {
	data? :AnyObject
	fields? :Field[]
	partial? :boolean
}

export interface ValidateTypesParameters {
	data? :AnyObject
	fields? :Field[]
}

export interface TypeCastToJavaParameters {
	data? :AnyObject
	fieldsObj :FieldsObject
}

export interface BuildIndexConfigParameterObject {
	//data :AnyObject
	fieldsObj :FieldsObject
	languages :string[]
}

export interface CreateParameterObject {
	addExtraFields? :boolean
	cleanExtraFields? :boolean
	collectionId? :string // TODO Scalar Regexp?
	collectionName? :string
	collectorId :string // TODO Scalar Regexp?
	collectorVersion :string // TODO Scalar Regexp?
	data? :{
		_name? :string
		_parentPath? :ParentPath
		_path? :Path
		[key :PropertyKey] :unknown
	}
	documentTypeId? :string // TODO Scalar Regexp?
	documentTypeName? :string
	fields? :Fields
	language? :string
	requireValid? :boolean
	//repoName? :string
	stemmingLanguage? :string
	validateOccurrences? :boolean
	validateTypes? :boolean
}

export interface UpdateParameterObject extends CreateParameterObject {
	data? :{
		_id? :string
		_name? :string
		_parentPath? :ParentPath
		_path? :Path
		[key :PropertyKey] :unknown
	}
	partial? :boolean
}
