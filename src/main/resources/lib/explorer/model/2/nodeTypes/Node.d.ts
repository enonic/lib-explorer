export type IndexConfigTemplate = 'none' | 'byType' | 'fulltext' | 'path' | 'minimal';

export interface DetailedIndexConfig {
	enabled: boolean;
	decideByType: boolean;
	nGram: boolean;
	fulltext: boolean;
	includeInAllText: boolean;
	path: boolean;
}

export interface PathIndexConfig {
	path: 'string'; // TODO Make more specific?,
	config: IndexConfigTemplate | DetailedIndexConfig;
}

export interface RootIndexConfig {
	default: IndexConfigTemplate | DetailedIndexConfig;
	configs: Array<	PathIndexConfig>;
}

export interface Node {
	_id?: string; // TODO uuid
	_name: string;
	_parentPath?: string;
	_path: string;
	_childOrder?: string, // TODO '_ts DESC'
	_inheritsPermissions?: boolean,
	_indexConfig: RootIndexConfig;
	_state?: string; // TODO 'DEFAULT'
	_nodeType?: string; // TODO 'default'
	_versionKey?: string; // TODO uuid
	_ts?: string; // TODO timestamp
	creator?: string; // TODO 'user:system:su'
	createdTime?: string; // timestamp
	type?: string;
}