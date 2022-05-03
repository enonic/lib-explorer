import type {PermissionsParams} from '@enonic/js-utils/src/types/Auth.d';
import type {IndexConfig} from './IndexConfig';


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

export type RequiredNodeProperties = {
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
