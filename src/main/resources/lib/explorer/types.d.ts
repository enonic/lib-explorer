export interface LooseObject {
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

export interface IndexConfigEntry {
	/**
	* If true, indexing is done based on valueType, according to the table above. I.e. numeric values are indexed as
	* both string and numeric.
	*/
	decideByType: boolean

	/**
	* If false, indexing will be disabled for the affected properties
	*/
	enabled: boolean

	/**
	* Values are stored as 'ngram'
	*/
	nGram: boolean

	/**
	* Values are stored as 'ngram', 'analyzed' and also added to the _allText system property
	*/
	fulltext: boolean

	/**
	* Affected values will be added to the _allText property
	*/
	includeInAllText: boolean

	/**
	* Values are stored as 'path' type and applicable for the pathMatch-function
	*/
	path: boolean

	indexValueProcessors: Array<any>
	languages: string[]
}

export type IndexConfigTemplates = "none" | "byType" | "fulltext" | "path" | "minimal";

export interface IndexConfig {
	default: IndexConfigEntry | IndexConfigTemplates;
	configs?: Array<{
		path: string;
		config: IndexConfigEntry | IndexConfigTemplates;
	}>;
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
