import type {
	ParentPath,
	Path
} from '/lib/explorer-typescript/types.d';

export type IndexConfigTemplate = 'none' | 'byType' | 'fulltext' | 'path' | 'minimal';

export interface DetailedIndexConfig {
	enabled: boolean;
	decideByType: boolean;
	nGram: boolean; // INDEX_CONFIG_N_GRAM
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
	_parentPath?: ParentPath;
	_path: Path;
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
