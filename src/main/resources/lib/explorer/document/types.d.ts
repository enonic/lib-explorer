import {
	PrincipalKey
} from '../types';


export interface Source {
	repoId: string;
	branch: string;
	user?: {
		login: string;
		idProvider?: string;
	};
	principals?: Array<PrincipalKey>;
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

export interface NodeCreateParams {
	/**
	* Name of content.
	*/
	_name?: string;

	/**
	* Path to place content under.
	*/
	_parentPath?: string;

	/**
	* How the document should be indexed. A default value "byType" will be set if no value specified.
	*/
	//_indexConfig?: IndexConfig;

	/**
	* The access control list for the node. By default the creator will have full access
	*/
	//_permissions?: ReadonlyArray<import("/lib/xp/content").PermissionsParams>;

	/**
	* true if the permissions should be inherited from the node parent. Default is false.
	*/
	_inheritsPermissions?: boolean;

	/**
	* Value used to order document when ordering by parent and child-order is set to manual
	*/
	_manualOrderValue?: number;

	/**
	* Default ordering of children when doing getChildren if no order is given in query
	*/
	_childOrder?: string;
}

export interface NodeGetParams {
	/**
	* Path or ID of the node.
	*/
	key: string;

	/**
	* Version to get
	*/
	versionId: string;
}

export interface RepoNode {
	_id: string;
	//_childOrder: string;
	//_indexConfig: IndexConfig;
	//_inheritsPermissions: boolean;
	//_permissions: ReadonlyArray<import("/lib/xp/content").PermissionsParams>;
	//_state: string;
	//_nodeType: string;
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
	//create<NodeData>(a: NodeData & NodeCreateParams): NodeData & RepoNode;
	create(data :LooseObject) :LooseObject

	/**
	* Deleting a node or nodes.
	*/
	//delete(keys: string | ReadonlyArray<string>): ReadonlyArray<string>;

	/**
	* Resolves the differences for a node between current and given branch.
	*/
	//diff(params: DiffParams): DiffResponse;

	/**
	* Checking if a node or nodes exist for the current context.
	*/
	//exists(keys: string | ReadonlyArray<string>): ReadonlyArray<string>;

	/**
	* Fetch the versions of a node.
	*/
	//findVersions(params: FindVersionsParams): NodeVersionQueryResult;

	/**
	* Fetches a specific node by path or ID.
	*/
	//get<NodeData>(key: string | NodeGetParams): NodeData & RepoNode;
	get(...keys :string[]) :unknown

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

	/**
	* Refresh the index for the current repoConnection
	*/
	//refresh(mode?: "ALL" | "SEARCH" | "STORAGE"): void;

	/**
	* This function modifies a node.
	*/
	//modify<NodeData>(params: NodeModifyParams<NodeData>): NodeData & RepoNode;

	/**
	* Rename a node or move it to a new path.
	*/
	//move(params: NodeMoveParams): boolean;

	/**
	* Pushes a node to a given branch.
	*/
	//push(params: PushNodeParams): PushNodeResult;

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

export type ConnectFunction = (params: Source) => RepoConnection;

type ArrayLengthMutationKeys = 'splice' | 'push' | 'pop' | 'shift' | 'unshift' | number
type ArrayItems<T extends Array<any>> = T extends Array<infer TItems> ? TItems : never
type FixedLengthArray<T extends any[]> =
  Pick<T, Exclude<keyof T, ArrayLengthMutationKeys>>
  & { [Symbol.iterator]: () => IterableIterator< ArrayItems<T> > }

type GeoPointArray = FixedLengthArray<[number, number]>;
export type GeoPointFunction = (v :GeoPointArray) => unknown;
export type StringFunction = (v :string) => unknown;
export type UnknownFunction = (v :unknown) => unknown;

export interface LooseObject {
	[key :string] :unknown
}

export interface Field {
	enabled? :boolean
	fulltext? :boolean
	includeInAllText? :boolean
	max? :number
	min? :number
	name :string
	nGram? :boolean
	path? :boolean
	valueType? :string
}

export type Fields = Field[];

export interface FieldsObject {
	[name :string] :Required<Omit<Field, 'name'>>
}

export interface AddExtraFieldsToDocumentTypeParams {
	data :LooseObject
	fieldsObj :FieldsObject
	updateDocumentType?: (fieldsObj :FieldsObject) => void
}

export interface CleanDataParameters {
	cleanExtraFields? :boolean,
	data :LooseObject,
	fieldsObj? :FieldsObject
}

export interface ValidateParameters {
	data :LooseObject
	fieldsObj :FieldsObject
	validateOccurrences? :boolean
	validateTypes? :boolean
	//documentType? :LooseObject
}

export interface ValidateOccurrencesParameters {
	data? :LooseObject
	fields? :Field[]
}

export interface ValidateTypesParameters {
	data? :LooseObject
	fields? :Field[]
}

export interface TypeCastToJavaParameters {
	data? :LooseObject
	fieldsObj :FieldsObject
}

export interface BuildIndexConfigParameterObject {
	//data :LooseObject
	fieldsObj :FieldsObject
	languages :string[]
}

export interface BuildIndexConfigJavaBridge {
	log? :Log
}

export interface CreateParameterObject {
	addExtraFields? :boolean
	cleanExtraFields? :boolean
	collectionId :string // TODO Scalar Regexp?
	collectionName? :string
	collectorId :string // TODO Scalar Regexp?
	collectorVersion :string // TODO Scalar Regexp?
	createdTime: unknown,
	data: LooseObject
	documentTypeId? :string // TODO Scalar Regexp?
	documentTypeName? :string
	fields? :Fields
	language? :string
	requireValid? :boolean
	//repoName? :string
	stemmingLanguage? :string
	validateOccurrences? :boolean
	validateTypes? :boolean
}

export type StemmingLanguageFromLocaleFunction = (locale :string) => string;

export interface CreateEnonicJavaBridge {
	connect :ConnectFunction
	log :Log
	geoPoint :GeoPointFunction
	geoPointString :StringFunction
	instant :UnknownFunction
	localDate :UnknownFunction
	localDateTime :UnknownFunction
	localTime :UnknownFunction
	reference :StringFunction
	stemmingLanguageFromLocale :StemmingLanguageFromLocaleFunction
}
