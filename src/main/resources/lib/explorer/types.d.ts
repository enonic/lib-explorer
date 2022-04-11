import type {BasicFilters} from '@enonic/js-utils/src/types/node/query/Filters.d';
import type {
	PermissionsParams,
	PrincipalKey
} from '@enonic/js-utils/src/types/Auth.d';

import type {
	Aggregations,
	AggregationsResponse
} from './types/Aggregation.d';
import type {IndexConfig} from './types/IndexConfig'

export type {
	PermissionsParams,
	PrincipalKey,
	PrincipalKeyRole,
	PrincipalKeyUser
} from '@enonic/js-utils/src/types/Auth.d';
export type {
	CreateRepoParams,
	RepositoryConfig
} from '@enonic/js-utils/src/types/Repo.d';
export type {
	Aggregation,
	AggregationsResponse
} from './types/Aggregation.d';
export type {
	IndexConfig,
	IndexConfigObject
} from './types/IndexConfig';

export type OneOrMore<T> = T | T[];
export type Unset = undefined | null;
export type ZeroOrMore<T> = Unset | OneOrMore<T>;

export type NonEmptyArray<T> = [T, ...T[]]
export type IsEmptyArray<T> = T extends any[]
  ? T extends NonEmptyArray<any>
    ? false
    : true
  : false

export interface LooseObject {
	//[key :PropertyKey] :unknown
	[key :string] :unknown
}

export interface User {
	readonly type: string;
	readonly key: string;
	readonly displayName: string;
	readonly disabled: boolean;
	readonly email: string;
	readonly login: string;
	readonly idProvider: string;
}

export interface AuthInfo {
	readonly user: User;
	readonly principals: ReadonlyArray<PrincipalKey>;
}

export type ContextAttributes = Record<string, string | boolean | number>;

export interface GetContext<
	Attributes extends ContextAttributes | undefined = undefined
> {
	readonly repository :string;
	readonly branch: string;
	readonly authInfo: AuthInfo;
	readonly attributes?: Attributes;
}

export type Name = string;
export type Id = string;
export type ChildOrder = `${string} ASC` | `${string} DESC`;
export type Path = `/${string}`;
export type State = string;
export type NodeType = string;
export type TimeStamp = string;
export type VersionKey = string;

export type Key = Id|Path;
export type ParentPath = Path;


export interface RequiredNodeProperties {
	_id: Id
	_childOrder: ChildOrder
	_indexConfig: IndexConfig
	_inheritsPermissions: boolean
	_name: Name
	_path: Path
	_permissions: Array<PermissionsParams>
	_state: State
	_nodeType: NodeType
	_ts :TimeStamp
	_versionKey :VersionKey
}


export type Node<T> = RequiredNodeProperties & T;


export interface NodeModifyParams {
	key :Id|Path
	editor: <T>(node :Node<T>) => Node<T>
}

export interface NodeCreateParams {
	_childOrder?: ChildOrder; // Default ordering of children when doing getChildren if no order is given in query
	_indexConfig?: IndexConfig; // How the document should be indexed. A default value "byType" will be set if no value specified.
	_inheritsPermissions?: boolean; // true if the permissions should be inherited from the node parent. Default is false.
	_manualOrderValue?: number; // Value used to order document when ordering by parent and child-order is set to manual
	_name?: Name; // Name of content.
	_nodeType? :string
	_parentPath?: ParentPath; // Path to place content under.
	_permissions?: ReadonlyArray<PermissionsParams>; // The access control list for the node. By default the creator will have full access
}

export interface NodeGetParams {
	key: Key; // Path or ID of the node.
	versionId: string; // Version to get
}

export interface CommitParams {
	/**
	* Node key to commit. It could be an id or a path. Prefer the usage of ID rather than paths.
	*/
	keys: string;

	/**
	* Optional commit message
	*/
	message?: string;
}

export interface CommitResponse {
	id: string;
	message: string;
	committer: string;
	timestamp: string;
}

export interface MultiCommitParams {
  keys: Array<string>;
  message?: string;
}

export interface QueryFilters {
	boolean?: {
		must?: BasicFilters | Array<BasicFilters>;
		mustNot?: BasicFilters | Array<BasicFilters>;
		should?: BasicFilters | Array<BasicFilters>;
	}
	exists?: {
		field: string;
	}
	notExists?: {
		field: string;
	}
	hasValue?: {
		field: string;
		values: Array<unknown>;
	}
	ids?: {
		values: Array<string>;
	}
}

export interface Highlight {
	encoder?: "default" | "html";
	fragmenter?: "simple" | "span";
	fragmentSize?: number;
	numberOfFragments?: number;
	noMatchSize?: number;
	order?: "score" | "none";
	preTag?: string;
	postTag?: string;
	requireFieldMatch?: boolean;
	tagsSchema?: string;
	properties?: Record<string, Highlight>; // Yes it's optional, no error will occur, but no highilights returned either
}

export interface HighlightResponse {
	readonly [uuid: string]:
	| {
		[name: string]: ReadonlyArray<string>;
	  }
	| undefined;
}

export interface PushNodeParams {
	key?: string; // Id or path to the nodes // TODO Does this parameter even exist outside the docs?
	keys: Array<string>; // Array of ids or paths to the nodes
	target: string; // Branch to push to
	includeChildren?: boolean; // Also push children of given nodes. Default is false.
	resolve?: boolean; // Resolve dependencies before pushing, meaning that references will also be pushed. Default is true.
	/**
	* Optional array of ids or paths to nodes not to be pushed.
	* If using this, be aware that nodes need to maintain data integrity (e.g parents must be present in target).
	* If data integrity is not maintained with excluded nodes, they will be pushed anyway.
	*/
	exclude?: Array<string>;
}

export interface PushNodeResult {
	success: Array<string>;
	failed: Array<{
		id: string;
		reason: string;
	}>;
	deleted: Array<string>;
}

export interface RepoConnection {
	/**
	* Commits the active version of nodes.
	*/
	//commit(params: CommitParams): CommitResponse;

	//commit(params: MultiCommitParams): ReadonlyArray<CommitResponse>;

	/**
	* Creating a node. To create a content where the name is not important and there could be multiple instances under the
	* same parent content, skip the name parameter and specify a displayName.
	*/
	create<T>(a: NodeCreateParams & T): Node<T>;

	/**
	* Deleting a node or nodes.
	*/
	delete(keys: string | ReadonlyArray<string>): ReadonlyArray<string>;
	delete(...keys: ReadonlyArray<string>): ReadonlyArray<string>;

	/**
	* Resolves the differences for a node between current and given branch.
	*/
	//diff(params: DiffParams): DiffResponse;

	/**
	* Checking if a node or nodes exist for the current context.
	*/
	exists(keys: string | Array<string>): Array<string>;

	/**
	* Fetch the versions of a node.
	*/
	//findVersions(params: FindVersionsParams): NodeVersionQueryResult;

	/**
	* Fetches a specific node by path or ID.
	*/
	//get<NodeData>(key: string | NodeGetParams): NodeData & RepoNode;
	//get(...keys :string[]) :unknown
	get<T>(...keys :string[]) :Node<T>

	/**
	* Fetches specific nodes by paths or IDs.
	*/
	//get<NodeData>(keys: ReadonlyArray<string | NodeGetParams>): ReadonlyArray<NodeData & RepoNode>;

	/**
	* Fetches specific nodes by path(s) or ID(s).
	*/
	/*get<NodeData>(
		keys: string | NodeGetParams | ReadonlyArray<string | NodeGetParams>
	): (NodeData & RepoNode) | ReadonlyArray<NodeData & RepoNode>;*/

	/**
	* This function fetches commit by id.
	* @since 7.7.0
	*/
	//getCommit(params: GetCommitParams): CommitResponse;

	/**
	* This function returns the active version of a node.
	*/
	//getActiveVersion(params: GetActiveVersionParams): any;

	/**
	* This function sets the active version of a node.
	*/
	//setActiveVersion(params: SetActiveVersionParams): boolean;

	/**
	* This function returns a binary stream.
	*/
	//getBinary(params: GetBinaryParams): import("/lib/xp/content").ByteSource;

	/**
	* This command queries nodes.
	*/
	/*query<AggregationKeys extends string = never>(
		params: NodeQueryParams<AggregationKeys>
	): NodeQueryResponse<AggregationKeys>;*/
	query<
		AggregationKey extends undefined|string = undefined
	>(object :{
		aggregations? :Aggregations<AggregationKey>
		count? :number
		filters? :QueryFilters
		highlight? :Highlight
		query :string
		sort? :string
		start? :number
	}) :{
		aggregations: AggregationsResponse<AggregationKey>
		count :number
		total :number
		highlight? :HighlightResponse
		hits :Array<{
			id :string
			score :number
		}>
	}

	/**
	* Refresh the index for the current repoConnection
	*/
	refresh(mode?: "ALL" | "SEARCH" | "STORAGE"): void;

	/**
	* This function modifies a node.
	*/
	//modify<T>(object: NodeModifyParams) :Node<T>
	modify<T>({
		key,
		editor
	}: {
		key :string
		editor: (node :Node<T>) => Node<T>
	}) :Node<T>

	/**
	* Rename a node or move it to a new path.
	*/
	//move(params: NodeMoveParams): boolean;
	move(object :{
		source :string
		target :string
	}) :boolean

	/**
	* Pushes a node to a given branch.
	*/
	push(params: PushNodeParams): PushNodeResult;

	/**
	* Set the order of the node’s children.
	*/
	//setChildOrder<NodeData>(params: SetChildOrderParams): NodeData & RepoNode;

	/**
	* Set the root node permissions and inheritance.
	*/
	//setRootPermission<NodeData>(params: SetRootPermissionParams): NodeData & RepoNode;

	/**
	* Get children for given node.
	*/
	//findChildren(params: NodeFindChildrenParams): NodeQueryResponse;
}
