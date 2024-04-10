import type { RequiredNodeProperties } from '@enonic-types/lib-explorer';

export interface RequiredMetaData {
	collection: string
	collector: {
		id: string
		version: string
	}
	createdTime: Date | string
	documentType: string
	language: string
	stemmingLanguage: string
	valid: boolean
}


export interface MetaData extends RequiredMetaData {
	modifiedTime?: Date | string
}

export interface CreatedMetaData extends RequiredMetaData {
	modifiedTime: never
}

export interface UpdatedMetaData extends RequiredMetaData {
	modifiedTime: Date | string
}


export interface DocumentNode extends RequiredNodeProperties {
	document_metadata: MetaData // modifiedTime is optional
	//[key: string]: unknown
}

export interface CreatedDocumentNode extends RequiredNodeProperties {
	document_metadata: CreatedMetaData // modifiedTime is never
}

export interface UpdatedDocumentNode extends RequiredNodeProperties {
	document_metadata: UpdatedMetaData // modifiedTime is required
}
