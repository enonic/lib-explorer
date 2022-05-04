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
	//RepoConnection,
	RequiredNodeProperties
} from './types/index.d';
export type {
	Aggregation,
	AggregationsResponse
} from './types/Aggregation.d';
export type {
	IndexConfig,
	IndexConfigObject
} from './types/IndexConfig';


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
