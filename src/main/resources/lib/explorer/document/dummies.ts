import type {
	ConnectFunction,
	GeoPointFunction,
	LooseObject,
	StringFunction,
	UnknownFunction
} from './types';

export const connectDummy :ConnectFunction = (/*source*/) => ({
	create: (data :LooseObject) => data,
	get: (key) => ({_id: key})
});

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

export const stemmingLanguageFromLocaleDummy = (locale :string) => {
	if (locale === 'en-GB') {
		return 'en';
	}
	return 'en';
}
