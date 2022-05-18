import type {
	ExplorerAdminGQLInterfaceNodeCommonProps,
	Node
} from './Node.d';


export interface FieldNodeSpecific {
	//creator :string
	//createdTime :Date|string
	fieldType :string // TODO? Rename to valueType?
	indexConfig :{
		decideByType :boolean
		enabled :boolean
		nGram :boolean
		fulltext :boolean
		includeInAllText :boolean
		path :boolean
	}
	isSystemField? :boolean
	key :string
	max :number
	min :number
	//modifier? :string
	//modifiedTime? :Date|string
}

export type FieldNode = Node<FieldNodeSpecific>

export type Field = ExplorerAdminGQLInterfaceNodeCommonProps<
	FieldNodeSpecific
	& {
		decideByType :boolean // Copy from indexConfig.decideByType
		enabled :boolean // Copy from indexConfig.enabled
		fulltext :boolean // Copy from indexConfig.fulltext
		includeInAllText :boolean // Copy from indexConfig.includeInAllText
		//isSystemField :boolean
		nGram :boolean // Copy from indexConfig.nGram
		path :boolean // Copy from indexConfig.path
		valueType :string // Just a copy of fieldType
	}
>
