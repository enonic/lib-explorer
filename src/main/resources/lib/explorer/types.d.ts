export type {
	RoleKey as PrincipalKeyRole,
	UserKey as PrincipalKeyUser,
} from '/lib/xp/auth';
export type {
	Aggregation,
	AggregationsResult as AggregationsResponse,
	AccessControlEntry as PermissionsParams,
	NodeConfigEntry as IndexConfigObject,
	NodeIndexConfigParams as IndexConfig
} from '/lib/xp/node';
export type {PrincipalKey} from '@enonic/js-utils/types/Auth.d';
export type {
	CreateRepoParams,
	RepositoryConfig
} from '@enonic/js-utils/types/Repo.d';
export type {RequiredNodeProperties} from './types/index.d';


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
