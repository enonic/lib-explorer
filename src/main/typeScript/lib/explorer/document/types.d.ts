import {
	LooseObject,
	Path,
	ParentPath,
	RequiredNodeProperties
} from '../types';

import {
	Field,
	Fields,
	FieldsObject
} from '../documentType/types.d';


export interface RequiredMetaData {
	collection :string
	collector :{
		id :string
		version :string
	}
	createdTime :Date | string
	documentType :string
	language :string
	stemmingLanguage :string
	valid :boolean
}


export interface MetaData extends RequiredMetaData {
	modifiedTime? :Date | string
}

export interface CreatedMetaData extends RequiredMetaData {
	modifiedTime :never
}

export interface UpdatedMetaData extends RequiredMetaData {
	modifiedTime :Date | string
}


export interface DocumentNode extends RequiredNodeProperties {
	document_metadata :MetaData // modifiedTime is optional
	//[key :string] :unknown
}

export interface CreatedDocumentNode extends RequiredNodeProperties {
	document_metadata :CreatedMetaData // modifiedTime is never
}

export interface UpdatedDocumentNode extends RequiredNodeProperties {
	document_metadata :UpdatedMetaData // modifiedTime is required
}

export interface RepoNode {
	_id: string;
	//_childOrder: string;
	//_indexConfig: IndexConfig;
	//_inheritsPermissions: boolean;
	//_permissions: ReadonlyArray<import("/lib/xp/content").PermissionsParams>;
	//_state: string;
	//_nodeType: string;
}

//export interface NodeModifyParams<NodeData> {
	/**
	* Path or ID of the node
	*/
	//key: string;

	/**
	* Editor callback function
	*/
	//editor: (node: NodeData & RepoNode) => NodeData & RepoNode;
//}

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
	collectionId :string // TODO Scalar Regexp?
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
