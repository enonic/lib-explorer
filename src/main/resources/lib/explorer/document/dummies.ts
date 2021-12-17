export const geoPointDummy = (v :number[]) :unknown => v;
export const geoPointStringDummy = (v :string) :unknown => v;
export const instantDummy = (v :unknown) :unknown => v;
export const localDateDummy = (v :unknown) :unknown => v;
export const localDateTimeDummy = (v :unknown) :unknown => v;
export const localTimeDummy = (v :unknown) :unknown => v;
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
export const referenceDummy = (v :string) :unknown => v;
