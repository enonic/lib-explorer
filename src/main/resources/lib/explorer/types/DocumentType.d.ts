import type {
	ExplorerAdminGQLInterfaceNodeCommonProps,
	Node,
	NodeCreate
} from './Node.d';


export type DocumentTypeField = {
	active ?:boolean // From GUI
	enabled ?:boolean
	decideByType ?:boolean
	fulltext ?:boolean
	includeInAllText ?:boolean
	max ?:number
	min ?:number
	name :string
	nGram ?:boolean
	path ?:boolean
	valueType ?:string
}

export type DocumentTypeFields = DocumentTypeField[];

export type DocumentTypeFieldsObject = {
	[name :string] :Required<Omit<DocumentTypeField, 'name'>>
}

export type DocumentTypeNodeSpecific = {
	addFields :boolean // Should default to true
	managedBy ?:string // Default is undefined
	properties :DocumentTypeFields
	//createdTime? :Date | string
	//modifiedTime? :string
}

export type DocumentTypeCreateParams = NodeCreate<Partial<DocumentTypeNodeSpecific>>

export type DocumentTypeNode = Node<DocumentTypeNodeSpecific>

export type DocumentType = ExplorerAdminGQLInterfaceNodeCommonProps<
	DocumentTypeNodeSpecific
>
