import type {PermissionsParams} from '@enonic/js-utils/src/types/Auth.d';
import type {IndexConfig} from './IndexConfig';
import type {AnyObject} from './Utility';


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


export type ExplorerAdminGQLInterfaceNodeCommonProps<T> = {
	_id :Id
	_name :Name
	_path :Path // Yes _path is also part of Explorer Admin GQL Interface Node
	_nodeType :NodeType
	_versionKey :VersionKey
} & T

export type RequiredNodeProperties = ExplorerAdminGQLInterfaceNodeCommonProps<{
	_childOrder :ChildOrder
	_indexConfig :IndexConfig
	_inheritsPermissions :boolean
	_permissions :Array<PermissionsParams>
	_state :State
	_ts :TimeStamp
}>

export type Node<T = AnyObject> = RequiredNodeProperties & T;

export type ScoreOptional<T> = Omit<T,'_score'> & {
	_score ?:number
}
export type ScoreRequired<T> = Omit<T,'_score'> & {
	_score :number
}

export type MultiRepoConnectionQueryNode = Node<{
	_branchId :string
	_repoId :string
	_score :number
}>

export interface NodeCreateParams {
	_childOrder ?:ChildOrder; // Default ordering of children when doing getChildren if no order is given in query
	_indexConfig ?:IndexConfig; // How the document should be indexed. A default value "byType" will be set if no value specified.
	_inheritsPermissions ?:boolean; // true if the permissions should be inherited from the node parent. Default is false.
	_manualOrderValue ?:number; // Value used to order document when ordering by parent and child-order is set to manual
	_name ?: Name; // Name of content.
	_nodeType ?:string
	_parentPath ?:ParentPath; // Path to place content under.
	_permissions ?:ReadonlyArray<PermissionsParams>; // The access control list for the node. By default the creator will have full access
}

export type NodeCreate<T> = NodeCreateParams & T;

export interface NodeGetParams {
	key :Key; // Path or ID of the node.
	versionId :string; // Version to get
}

export interface NodeModifyParams {
	key :Id|Path
	editor :<T>(node :Node<T>) => Node<T>
}
