import type {
	AccessControlEntry,
	Node,
	// NodeIndexConfig,
	NodeIndexConfigParams
} from '/lib/xp/node';
import type {Explorer} from './Application';


export type {
	Node
} from '/lib/xp/node';


export type Name = Node['_name'];
export type Id = Node['_id'];
export type ChildOrder = Node['_childOrder']; // `${string} ASC` | `${string} DESC`;
export type Path = Node['_path']; // `/${string}`;
export type State = Node['_state'];

export type NodeType = `${Explorer.Application.Name}:${string}`;
export type NodeTypeGeneric<S extends string> = `${Explorer.Application.Name}:${S}`;

export type TimeStamp = Node['_ts'];
export type VersionKey = Node['_versionKey'];

export type Key = Id|Path;
export type ParentPath = Path;


export type ExplorerAdminGQLInterfaceNodeCommonProps<T> = {
	_id: Id
	_name: Name
	_path: Path // Yes _path is also part of Explorer Admin GQL Interface Node
	_nodeType: NodeType
	_versionKey: VersionKey
} & T

export type RequiredNodeProperties = ExplorerAdminGQLInterfaceNodeCommonProps<{
	_childOrder: ChildOrder
	_indexConfig: NodeIndexConfigParams
	_inheritsPermissions: boolean
	_permissions: AccessControlEntry[]
	_state: State
	_ts: TimeStamp
}>

export type ScoreOptional<T> = Omit<T,'_score'> & {
	_score ?:number
}
export type ScoreRequired<T> = Omit<T,'_score'> & {
	_score: number
}

export type MultiRepoConnectionQueryNode = Node<{
	_branchId: string
	_repoId: string
	_score: number
}>

export type NodeCreateParams = {
	_childOrder?: ChildOrder; // Default ordering of children when doing getChildren if no order is given in query
	_indexConfig?: NodeIndexConfigParams; // How the document should be indexed. A default value "byType" will be set if no value specified.
	_inheritsPermissions?: boolean; // true if the permissions should be inherited from the node parent. Default is false.
	_manualOrderValue?: number; // Value used to order document when ordering by parent and child-order is set to manual
	_name?: Name; // Name of content.
	_nodeType?: string
	_parentPath?: ParentPath; // Path to place content under.
	_permissions?: AccessControlEntry[]; // The access control list for the node. By default the creator will have full access
}

export type NodeCreate<T> = NodeCreateParams & T;

export interface NodeGetParams {
	key: Key; // Path or ID of the node.
	versionId: string; // Version to get
}

export interface NodeModifyParams {
	key: Id|Path
	editor: <T>(node: Node<T>) => Node<T>
}
