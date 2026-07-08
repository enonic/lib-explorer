import type {
	CreateNodeParams,
	Node,
} from '/lib/xp/node';

import type { ExplorerAdminGQLInterfaceNodeCommonProps } from './Node.d';

// Similar to NodeConfigEntry, but without indexValueProcessors and languages;
export type DocumentTypeField = {
	active?: boolean; // From GUI
	enabled?: boolean; // Required in NodeConfigEntry.
	decideByType?: boolean; // Required in NodeConfigEntry.
	fulltext?: boolean; // Required in NodeConfigEntry.
	includeInAllText?: boolean; // Required in NodeConfigEntry.
	max?: number;
	min?: number;
	name: string;
	nGram?: boolean; // Required in NodeConfigEntry.
	path?: boolean; // Required in NodeConfigEntry.
	stemmed?: boolean;
	valueType?: string;
}

export type DocumentTypeFields = DocumentTypeField[];

export type DocumentTypeFieldsObject = {
	[name: string]: Required<Omit<DocumentTypeField, 'name'>>
}

export interface DocumentTypesJsonDocumentType {
	_name: string
	addFields?: boolean
	version?: number
	properties?: DocumentTypeFields
}

export type DocumentTypesJson = DocumentTypesJsonDocumentType[];

export type DocumentTypeNodeSpecific = {
	addFields: boolean // Should default to true
	version?: number // undefined defaults to 0.
	managedBy?: string // Default is undefined
	properties: DocumentTypeFields
	// createdTime?: Date | string
	// modifiedTime?: string
}

export type DocumentTypeCreateParams = CreateNodeParams<Partial<DocumentTypeNodeSpecific>>

export type DocumentTypeNode = Node<DocumentTypeNodeSpecific>

export type DocumentType = ExplorerAdminGQLInterfaceNodeCommonProps<
	DocumentTypeNodeSpecific
>
