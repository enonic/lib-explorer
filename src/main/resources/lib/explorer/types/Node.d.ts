import type {
	CreateNodeParams,
	GetNodeParams,
	ModifyNodeParams,
	Node,
	// NodeIndexConfig,
	NodeIndexConfigParams,
	NodeMultiRepoQueryResult,
	NodeQueryResultHit,
} from '/lib/xp/node';
import type {Explorer} from './Application';
import type {Unwrapped} from './Utility';

export type {
	Node
} from '/lib/xp/node';


export type ExplorerAdminGQLInterfaceNodeCommonProps<T> = {
	_id: Node['_id']
	_name:  Node['_name']
	_path: Node['_path'] // Yes _path is also part of Explorer Admin GQL Interface Node
	_nodeType: Node['_nodeType']
	_versionKey: Node['_versionKey']
} & T

export type RequiredNodeProperties = ExplorerAdminGQLInterfaceNodeCommonProps<{
	_childOrder: Node['_childOrder']

	// Node['_indexConfig']: NodeIndexConfig
	// CreateNodeParams['_indexConfig']: Partial<NodeIndexConfigParams>
	_indexConfig: NodeIndexConfigParams

	_inheritsPermissions: Node['_inheritsPermissions']
	_permissions: Node['_permissions']
	_state: Node['_state']
	_ts: Node['_ts']
}>

export type ScoreOptional<T> = Omit<T,'_score'> & {
	_score?: NodeQueryResultHit['score']
}
export type ScoreRequired<T> = Omit<T,'_score'> & {
	_score: NodeQueryResultHit['score']
}

export type MultiRepoConnectionQueryNode = Node<{
	_branchId: Unwrapped<NodeMultiRepoQueryResult['hits']>['branch']
	_repoId: Unwrapped<NodeMultiRepoQueryResult['hits']>['repoId']
	_score: NodeQueryResultHit['score']
}>

export type NodeCreateParams = {
	_childOrder?: CreateNodeParams['_childOrder']; // Default ordering of children when doing getChildren if no order is given in query
	_indexConfig?: CreateNodeParams['_indexConfig']; // How the document should be indexed. A default value "byType" will be set if no value specified.
	_inheritsPermissions?: CreateNodeParams['_inheritsPermissions']; // true if the permissions should be inherited from the node parent. Default is false.
	_manualOrderValue?: CreateNodeParams['_manualOrderValue']; // Value used to order document when ordering by parent and child-order is set to manual
	_name?: CreateNodeParams['_name']; // Name of content.
	_nodeType?: Node['_nodeType'] // TODO: CreateNodeParams doesn't have this
	_parentPath?: CreateNodeParams['_childOrder']; // Path to place content under.
	_permissions?: CreateNodeParams['_permissions']; // The access control list for the node. By default the creator will have full access
}

//──────────────────────────────────────────────────────────────────────────────
// Deprecated / Backwards compatibility
//──────────────────────────────────────────────────────────────────────────────
export type Name = Node['_name'];
export type Id = Node['_id'];
export type ChildOrder = Node['_childOrder']; // `${string} ASC` | `${string} DESC`;
export type Path = Node['_path']; // `/${string}`;
export type State = Node['_state'];

export type NodeType = Node['_nodeType']; // `${Explorer.Application.Name}:${T}`; // Making it stricter just causes collisions with /lib/xp/node
export type NodeTypeGeneric<S extends string> = `${Explorer.Application.Name}:${S}`;

export type TimeStamp = Node['_ts'];
export type VersionKey = Node['_versionKey'];

export type Key = Node['_id']|Node['_path'];
export type ParentPath = Node['_path'];

export type NodeCreate = CreateNodeParams;
export type NodeGetParams = GetNodeParams;
export type NodeModifyParams = ModifyNodeParams;
