import type {
	App,
	Log
} from '../../../index.d';
import type {
	AggregationsResponse,
	Node,
	NodeCreateParams
} from '/lib/explorer/types.d';
import type {
	ConnectFunction,
	GeoPointFunction,
	JavaBridge,
	StringFunction,
	UnknownFunction,
} from '../_coupling/types.d';

export const appDummy :App = {
	config: {},
	name: 'com.enonic.app.explorer',
	version: '0.0.1'
};

export const connectDummy :ConnectFunction = (/*source*/) => ({
	create: <T>(data :NodeCreateParams & T) :Node<T> => data as Node<T>,
	exists: (key) => (Array.isArray(key) ? key : [key]),
	get: <T>(key:string) => ({_id: key}) as Node<T>,
	modify: <T>(
		//@ts-ignore
		{
			key,
			editor
		}
	) => {
		return {} as Node<T>;
	},
	move: () => true,
	query: <AggregationKey extends string = never>(/*{
		aggregations: {}
	}*/) => ({
		aggregations: {} as AggregationsResponse<AggregationKey>,
		count: 0,
		hits: [],
		total: 0
	}),
	push: () => ({
		success: [],
		failed: [],
		deleted: []
	}),
	refresh: () => undefined
});

export const libRepoDummy = {
	create: ({
		id,
		settings
	}) => {
		return {
			id,
			branches: ['master'],
			settings
		}
	},
	get: (repoId :string) => {
		return {
			id: repoId,
			branches: ['master'],
			settings: {}
		}
	},
	list: () => {
		return [];
	}
}

export const geoPointDummy :GeoPointFunction = (v) => v;
export const geoPointStringDummy :StringFunction = (v) => v;
export const instantDummy :UnknownFunction = (v) => v;
export const localDateDummy :UnknownFunction = (v) => v;
export const localDateTimeDummy :UnknownFunction = (v) => v;
export const localTimeDummy :UnknownFunction = (v) => v;
export const logDummy :Log = {
	error: () => {
		// no-op
	},
	debug: () => {
		// no-op
	},
	info: () => {
		// no-op
	},
	warning: () => {
		// no-op
	}
};
export const referenceDummy :StringFunction = (v) => v;

export const libValueDummy = {
	geoPoint: geoPointDummy,
	geoPointString: geoPointStringDummy,
	instant: instantDummy,
	localDate: localDateDummy,
	localDateTime: localDateTimeDummy,
	localTime: localTimeDummy,
	reference: referenceDummy
};

export const stemmingLanguageFromLocaleDummy = (locale :string) => {
	if (locale === 'en-GB') {
		return 'en';
	}
	return 'en';
}

export const javaBridgeDummy :JavaBridge = {
	app: appDummy,
	connect: connectDummy,
	log: logDummy,
	repo: libRepoDummy,
	value: libValueDummy,
	stemmingLanguageFromLocale: stemmingLanguageFromLocaleDummy
};
