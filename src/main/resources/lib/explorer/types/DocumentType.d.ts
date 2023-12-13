import type {
	CreateNodeParams,
	Node,
} from '/lib/xp/node';

import type { ExplorerAdminGQLInterfaceNodeCommonProps } from './Node.d';


export type DocumentTypeField = {
	active?: boolean // From GUI
	enabled?: boolean
	decideByType?: boolean
	fulltext?: boolean
	includeInAllText?: boolean
	max?: number
	min?: number
	name: string
	nGram?: boolean
	path?: boolean
	stemmed?: boolean
	valueType?: string
}

export type DocumentTypeFields = DocumentTypeField[];

export type DocumentTypeFieldsObject = {
	[name: string]: Required<Omit<DocumentTypeField, 'name'>>
}

export interface DocumentTypesJsonDocumentType {
	_name: string
	addFields?: boolean
	documentTypeVersion?: number
	properties?: DocumentTypeFields
}

export type DocumentTypesJson = DocumentTypesJsonDocumentType[];

export type DocumentTypeNodeSpecific = {
	addFields: boolean // Should default to true
	documentTypeVersion?: number // undefined defaults to 0.
	managedBy?: string // Default is undefined
	properties: DocumentTypeFields
	//createdTime?: Date | string
	//modifiedTime?: string
}

export type DocumentTypeCreateParams = CreateNodeParams<Partial<DocumentTypeNodeSpecific>>

export type DocumentTypeNode = Node<DocumentTypeNodeSpecific>

export type DocumentType = ExplorerAdminGQLInterfaceNodeCommonProps<
	DocumentTypeNodeSpecific
>
