import type {
	ExplorerAdminGQLInterfaceNodeCommonProps,
	Node,
	NodeCreate,
	ScoreRequired
} from './Node.d';


export type CollectionId = string

export type CollectionNodeSpecific = {
	collector ?:{ // Yes it's optional, a collection doesn't require a collector
		config :Object // TODO?
		name :string
		configJson :string
	}
	createdTime :Date | string
	creator :string,
	//cron :never // This is no longer stored on the CollectionNode but in the scheduling repo
	doCollect? :boolean

	// Typically a documentType will be created, if none is selected, but there
	// might exist historical collections without a documentType
	documentTypeId ?:string

	language :string
	modifiedTime? :Date | string
	modifier? :string
}

export type CollectionNode = Node<CollectionNodeSpecific>;

export type CollectionNodeCreateParams = NodeCreate<CollectionNodeSpecific>

export type CollectionGQLSpecific = {
	documentCount :number // not stored, added by graphql
	interfaces :Array<string> // not stored, added by graphql
}

export type Collection = ExplorerAdminGQLInterfaceNodeCommonProps<
	CollectionNodeSpecific
>

export type Cron = {
	minute :string,
	hour :string,
	dayOfMonth :string,
	month :string,
	dayOfWeek :string
}

export type CollectionWithCron = Collection & {
	cron :Cron | Array<Cron>
};

export type QueriedCollection = ScoreRequired<CollectionNode>
