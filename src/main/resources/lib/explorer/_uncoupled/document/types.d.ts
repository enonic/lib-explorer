import {
	AnyObject,
	DocumentTypeFields,
	DocumentTypeFieldsObject,
	Path,
	ParentPath
} from '/lib/explorer/types/index.d';


export interface AddExtraFieldsToDocumentTypeParams {
	data: AnyObject
	documentTypeId: string
	fieldsObj: DocumentTypeFieldsObject
}

export interface CleanDataParameters {
	cleanExtraFields?: boolean,
	data: AnyObject,
	fieldsObj?: DocumentTypeFieldsObject
}

export interface ValidateParameters {
	data: AnyObject
	fieldsObj: DocumentTypeFieldsObject
	partial?: boolean
	validateOccurrences?: boolean
	validateTypes?: boolean
	//documentType?: AnyObject
}

export interface ValidateOccurrencesParameters {
	data?: AnyObject
	fields?: DocumentTypeFields
	partial?: boolean
}

export interface ValidateTypesParameters {
	data?: AnyObject
	fields?: DocumentTypeFields
}

export interface TypeCastToJavaParameters {
	data?: AnyObject
	fieldsObj: DocumentTypeFieldsObject
}

export interface BuildIndexConfigParameterObject {
	//data: AnyObject
	fieldsObj: DocumentTypeFieldsObject
	languages: string[]
}

export interface CreateParameterObject {
	addExtraFields?: boolean
	cleanExtraFields?: boolean
	collectionId?: string // TODO Scalar Regexp?
	collectionName?: string
	collectorId: string // TODO Scalar Regexp?
	collectorVersion: string // TODO Scalar Regexp?
	data?: {
		_name?: string
		_parentPath?: ParentPath
		_path?: Path
		[key: PropertyKey]: unknown
	}
	documentTypeId?: string // TODO Scalar Regexp?
	documentTypeName?: string
	fields?: DocumentTypeFields
	language?: string
	requireValid?: boolean
	//repoName?: string
	stemmingLanguage?: string
	validateOccurrences?: boolean
	validateTypes?: boolean
}

export interface UpdateParameterObject extends CreateParameterObject {
	data?: {
		_id?: string
		_name?: string
		_parentPath?: ParentPath
		_path?: Path
		[key: PropertyKey]: unknown
	}
	partial?: boolean
}
