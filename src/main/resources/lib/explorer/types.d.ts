import type {IndexConfig} from './types/IndexConfig'


export interface LooseObject {
	//[key :PropertyKey] :unknown
	[key :string] :unknown
}

export type PrincipalKeySystem =
	| "role:system.everyone"
	| "role:system.authenticated"
	| "role:system.admin"
	| "role:system.admin.login"
	| "role:system.auditlog"
	| "role:system.user.admin"
	| "role:system.user.app"
	| "user:system:su";

export type PrincipalKeyUser = `user:${string}:${string}`;
export type PrincipalKeyGroup = `group:${string}:${string}`;
export type PrincipalKeyRole = `role:${string}`;

export type PrincipalKey = PrincipalKeySystem | PrincipalKeyUser | PrincipalKeyGroup | PrincipalKeyRole;

export type Permission =
	| "READ"
	| "CREATE"
	| "MODIFY"
	| "DELETE"
	| "PUBLISH"
	| "READ_PERMISSIONS"
	| "WRITE_PERMISSIONS";

export interface PermissionsParams {
	principal: PrincipalKey
	allow: Array<Permission>
	deny: Array<Permission>
}

export interface RequiredNodeProperties {
	_id: string
	_childOrder: string
	_indexConfig: IndexConfig
	_inheritsPermissions: boolean
	_name: string
	_path: string
	_permissions: PermissionsParams[]
	_state: string
	_nodeType: string
	_ts :string
	_versionKey :string
}

export type CreatedNode = RequiredNodeProperties & LooseObject;

export interface RequiredMetaData {
	collection :string
	collector :{
		id :string
		version :string
	}
	createdTime :string
	documentType :string
	language :string
	stemmingLanguage :string
	valid :boolean
}

export interface RequiredMetaDataAfterUpdate extends RequiredMetaData {
	modifiedTime :string
}

export interface RequiredDocumentNode extends RequiredNodeProperties {
	document_metadata :RequiredMetaData
}

export interface RequiredDocumentNodeAfterUpdate extends RequiredNodeProperties {
	document_metadata :RequiredMetaDataAfterUpdate
}

export type CreatedDocumentTypeNode = RequiredDocumentNode & LooseObject;
export type UpdatedDocumentTypeNode = RequiredDocumentNodeAfterUpdate & LooseObject;

export interface UpdatedNode extends CreatedNode {
	modifiedTime :string
}

export interface NodeModifyParams {
	key :string
	//editor: (node: RequiredNodeProperties & LooseObject) => RequiredNodeProperties & LooseObject;
	editor: (node :CreatedNode) => UpdatedNode
	//node?: UpdatedNode
}

export interface NodeModifyDummyParams {
	key? :string
	editor?: (node :CreatedNode) => UpdatedNode
	node: UpdatedNode
}
