import type {Highlight} from '@enonic/js-utils/src/types/node/query/Highlight.d';
import type {
	Aggregations,
	AggregationsResponse
} from './Aggregation.d';
import type {
	QueryFilters
} from './Filters.d';
import type {
	Node,
	NodeCreateParams
} from './Node.d';


interface HighlightResponse {
	readonly [uuid: string]:
	| {
		[name: string]: ReadonlyArray<string>;
	  }
	| undefined;
}

interface PushNodeParams {
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

interface PushNodeResult {
	success: Array<string>;
	failed: Array<{
		id: string;
		reason: string;
	}>;
	deleted: Array<string>;
}

export type RepoConnection = {
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
	// The documentation does NOT match reality
	// https://developer.enonic.com/docs/xp/stable/api/lib-node#exists
	// I know a single key returns a single boolean, but I haven't tested mulitple keys.

	// These specific overload signatures give type errors on any generic implementation :(
	//exists(key: string) :boolean;
	//exists(keys: Array<string>) :Array<string>;
	/*exists<
		Keys extends string|Array<string>
	>(keyOrKeys: Keys) :Keys extends string ? boolean : Array<string>;*/

	//  This generic signature works :)
	exists(keyOrKeys: string|Array<string>) :boolean|Array<string>;

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
