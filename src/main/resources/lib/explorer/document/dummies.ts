import type {
	LooseObject,
	UpdatedNode
} from '../types';
import type {
	ConnectFunction,
	GeoPointFunction,
	JavaBridge,
	StringFunction,
	UnknownFunction,
} from './types';

export const connectDummy :ConnectFunction = (/*source*/) => ({
	create: (data :LooseObject) => data,
	get: (key) => ({_id: key}),
	modify: (obj) => {
		const {
			//key,
			//editor, // function ref
			node
		} = obj;
		return node as UpdatedNode;
	}
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
	connect: connectDummy,
	log: logDummy,
	repo: libRepoDummy,
	value: libValueDummy,
	stemmingLanguageFromLocale: stemmingLanguageFromLocaleDummy
};
