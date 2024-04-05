export const APP_NAME = 'com.enonic.lib.explorer';
export const EXPLORER_VERSION = '4.4.3';

const DIR_SRC = 'src/main/resources';
const AND_BELOW = '**';
const SOURCE_FILES = `*.{ts,tsx}`;
const TEST_EXT = `{spec,test}.{ts,tsx}`;
const TEST_FILES = `*.${TEST_EXT}`;


export default {
	collectCoverageFrom: [
		`${DIR_SRC}/${AND_BELOW}/${SOURCE_FILES}`,
	],

	coveragePathIgnorePatterns: [
		'/bin/',
		'/node_modules/',
		'/test/',
	],

	// In order for tests to work on all files, we have to use v8 coverage provider.
	coverageProvider: 'v8', // Changes Uncovered Lines

	globals: {
		app: {
			name: APP_NAME,
			version: EXPLORER_VERSION
		},
	},

	// It seems mocks doesn't apply to mapped modules?
	moduleNameMapper: {
		'@enonic/js-utils/(.*)': '<rootDir>/node_modules/@enonic/js-utils/$1',
		'/lib/explorer/(.*)': '<rootDir>/src/main/resources/lib/explorer/$1'
	},

	preset: 'ts-jest/presets/js-with-babel-legacy',
	// preset: 'ts-jest/presets/js-with-babel',

	// testEnvironment: 'jsdom', // Clientside
	testEnvironment: 'node',

	testMatch: [
		`<rootDir>/${DIR_SRC}/${AND_BELOW}/${TEST_FILES}`,
		`<rootDir>/test/${AND_BELOW}/${TEST_FILES}`
	],

	transform: {
		'^.+\\.(js|jsx|ts|tsx)$': [
			'ts-jest',
			{
				tsconfig: 'test/tsconfig.json'
			}
		]
	},

	transformIgnorePatterns: [
		'/node_modules/(?!@enonic/(js-utils|mock-xp))',
	]
}
