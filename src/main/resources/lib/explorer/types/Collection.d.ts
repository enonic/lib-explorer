import type {
	CreateNodeParams,
	Node
} from '/lib/xp/node';
import type { Reference } from '/lib/xp/value';
import type {
	ExplorerAdminGQLInterfaceNodeCommonProps,
	NodeTypeGeneric,
	ScoreRequired
} from './Node.d';


export type NodeTypeCollection = NodeTypeGeneric<'collection'>;


export type CollectionFormValues<Config extends Record<string, unknown> = Record<string, unknown>> = {
	_id?: string
	_name: string
	_path: string
	collector: {
		configJson?: string
		config?: Config
		name: string
	}
	cron: {
		month: string
		dayOfMonth: string
		dayOfWeek: string
		minute: string
		hour: string
	}[]
	doCollect: boolean
	documentTypeId?: string // Reference
	language: string
};

export type CollectionId = string

export type CollectionNodeSpecific = {
	_nodeType: NodeTypeCollection
	collector?: { // Yes it's optional, a collection doesn't require a collector
		config: Record<string, unknown>; // Different for each Collector
		name: string;
		configJson: string;
	}
	createdTime: Date | string
	creator: string,
	//cron: never // This is no longer stored on the CollectionNode but in the scheduling repo
	doCollect?: boolean

	// Typically a documentType will be created, if none is selected, but there
	// might exist historical collections without a documentType
	documentTypeId?: string | Reference

	language: string
	modifiedTime?: Date | string
	modifier?: string
}

export type CollectionNode = Node<CollectionNodeSpecific>;

export type CollectionNodeCreateParams = CreateNodeParams<CollectionNodeSpecific>

export type CollectionGQLSpecific = {
	documentCount: number // not stored, added by graphql
	interfaces: string[] // not stored, added by graphql
}

export type Collection = ExplorerAdminGQLInterfaceNodeCommonProps<
	CollectionNodeSpecific
>

export type Cron = {
	minute: string,
	hour: string,
	dayOfMonth: string,
	month: string,
	dayOfWeek: string
}

export type CollectionWithCron = Collection & {
	cron: Cron | Cron[]
};

export type QueriedCollection = ScoreRequired<CollectionNode>
