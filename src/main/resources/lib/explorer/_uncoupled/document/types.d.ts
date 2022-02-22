import {
	LooseObject,
	Path,
	ParentPath
} from '../../types';

import {
	Field,
	Fields,
	FieldsObject
} from '../../documentType/types.d';


export interface AddExtraFieldsToDocumentTypeParams {
	data :LooseObject
	documentTypeId :string
	fieldsObj :FieldsObject
}

export interface CleanDataParameters {
	cleanExtraFields? :boolean,
	data :LooseObject,
	fieldsObj? :FieldsObject
}

export interface ValidateParameters {
	data :LooseObject
	fieldsObj :FieldsObject
	partial? :boolean
	validateOccurrences? :boolean
	validateTypes? :boolean
	//documentType? :LooseObject
}

export interface ValidateOccurrencesParameters {
	data? :LooseObject
	fields? :Field[]
	partial? :boolean
}

export interface ValidateTypesParameters {
	data? :LooseObject
	fields? :Field[]
}

export interface TypeCastToJavaParameters {
	data? :LooseObject
	fieldsObj :FieldsObject
}

export interface BuildIndexConfigParameterObject {
	//data :LooseObject
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
