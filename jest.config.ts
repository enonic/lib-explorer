export const APP_NAME = 'com.enonic.lib.explorer';
export const EXPLORER_VERSION = '4.4.3';

const DIR_SRC_MAIN_RESOURCES = 'src/main/resources';
const AND_BELOW = '**';
const SOURCE_FILES = `*.{ts,tsx}`;
const TEST_EXT = `{spec,test}.{ts,tsx}`;
const TEST_FILES = `*.${TEST_EXT}`;


export default {
	collectCoverageFrom: [
		`${DIR_SRC_MAIN_RESOURCES}/${AND_BELOW}/${SOURCE_FILES}`,
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

	// Each setup file will be run once per test file.
	// Since every test file runs in its own environment, these scripts will be executed in the
	// testing environment before executing setupFilesAfterEnv and before the test code itself.
	setupFiles: [
		`<rootDir>/src/jest/setupGlobalThis.ts`,
		`<rootDir>/src/jest/setupMockXp.ts`,
	],

	// Since setupFiles executes before the test framework is installed in the environment, this
	// script file presents you the opportunity of running some code immediately after the test
	// framework has been installed in the environment but before the test code itself.
	setupFilesAfterEnv: [],

	// testEnvironment: 'jsdom', // Clientside
	testEnvironment: 'node',

	testMatch: [
		`<rootDir>/${DIR_SRC_MAIN_RESOURCES}/${AND_BELOW}/${TEST_FILES}`,
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
