import type {
	App,
	Log
} from '../../../index.d';
import type {
	CreateRepoParams,
	PrincipalKey,
	RepoConnection,
	RepositoryConfig
} from '/lib/explorer/types.d';


export interface Source {
	repoId: string;
	branch: string;
	user?: {
		login: string;
		idProvider?: string;
	};
	principals?: Array<PrincipalKey>;
}

export type ConnectFunction = (params: Source) => RepoConnection;

/*type ArrayLengthMutationKeys = 'splice' | 'push' | 'pop' | 'shift' | 'unshift' | number
type ArrayItems<T extends Array<any>> = T extends Array<infer TItems> ? TItems : never
type FixedLengthArray<T extends any[]> =
  Pick<T, Exclude<keyof T, ArrayLengthMutationKeys>>
  & { [Symbol.iterator]: () => IterableIterator< ArrayItems<T> > }

type GeoPointArray = FixedLengthArray<[number, number]>;*/
//export type GeoPointArray = [number, number]; // Tuple
export type GeoPointFunction = (lat :number, lon :number) => unknown;
export type StringFunction = (v :string) => unknown;
export type UnknownFunction = (v :unknown) => unknown;

export interface RepoLib {
	create(param :CreateRepoParams) :RepositoryConfig
	get(repoId :string) :RepositoryConfig
	list() :RepositoryConfig[]
}

export interface ValueLib {
	geoPoint :GeoPointFunction
	geoPointString :StringFunction
	instant :UnknownFunction
	localDate :UnknownFunction
	localDateTime :UnknownFunction
	localTime :UnknownFunction
	reference :StringFunction
}

export type StemmingLanguageFromLocaleFunction = (locale :string) => string;

export interface JavaBridge {
	app :App
	connect :ConnectFunction
	log :Log
	repo :RepoLib
	value :ValueLib
	stemmingLanguageFromLocale :StemmingLanguageFromLocaleFunction
}
