import type {
	ConnectParams,
	RepoConnection,
} from '/lib/xp/node';
import type {EventLib} from '@enonic/js-utils/src/types/index.d';
import type {PrincipalKey} from '@enonic/js-utils/src/types/Auth.d';

// TODO Use instead of below
// import type {RepoLibrary as RepoLib} from '@enonic-types/lib-repo';
// import type {ValueLibrary} from '/lib/xp/value';
// TODO Replace with above
export type RepoLib = XpLibraries["/lib/xp/repo"];
export type ValueLib = XpLibraries["/lib/xp/value"];

export type Source = {
	repoId: ConnectParams['repoId']
	branch: ConnectParams['branch'];
	user?: ConnectParams['user'];
	principals?: PrincipalKey[]; // With autocomplete
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


// export type ValueLib = {
// 	geoPoint :GeoPointFunction
// 	geoPointString :StringFunction
// 	instant :UnknownFunction
// 	localDate :UnknownFunction
// 	localDateTime :UnknownFunction
// 	localTime :UnknownFunction
// 	reference :StringFunction
// }

export type StemmingLanguageFromLocaleFunction = (locale :string) => string;

export type JavaBridge = {
	app: typeof app
	connect: ConnectFunction
	event: EventLib
	log: typeof log
	repo: RepoLib
	value: ValueLib
	stemmingLanguageFromLocale: StemmingLanguageFromLocaleFunction
}
