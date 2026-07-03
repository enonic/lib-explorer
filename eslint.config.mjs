import js from '@eslint/js';
import {defineConfig, globalIgnores} from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';


export default defineConfig([
	globalIgnores([
		'build/**'
	]),
	{
		files: [
			'**/*.js',
			'**/*.ts',
			'**/*.tsx'
		],
		extends: [
			js.configs.recommended,
			tseslint.configs.recommended,
		],
		languageOptions: {
			globals: {
				...globals.es2020,

				// Node
				__dirname: 'readonly',

				// CommonJS (CJS) format
				exports: 'writable',
				module: 'writable',

				// Nashorn
				java: 'readonly', // Exceptions
				Java: 'readonly',

				// Enonic XP
				app: 'readonly',
				log: 'readonly',
				resolve: 'readonly',
				__: 'readonly',
			},
			parserOptions: {
				ecmaFeatures: {
					jsx: true,
				},
			},
		},
		rules: { // https://eslint.org/docs/rules
			'@typescript-eslint/ban-ts-comment': ['error', {
				'ts-expect-error': false, // 'allow-with-comment'
				'ts-ignore': false, // 'allow-with-comment'
				'ts-nocheck': true,
				'ts-check': true
			}],
			'@typescript-eslint/no-inferrable-types': ['off'],
			'@typescript-eslint/no-require-imports': ['off'], // require() is idiomatic in Enonic XP server-side code
			// path references are needed for global augmentation (e.g. types/lib-node.augment.d.ts),
			// converting them to import style breaks augmentation in consuming projects (app-explorer)
			'@typescript-eslint/triple-slash-reference': ['error', {path: 'always'}],
			'@typescript-eslint/no-unused-expressions': ['error', {
				allowShortCircuit: true, // DEBUG && log.debug(...)
				allowTernary: true
			}],
			'@typescript-eslint/no-unused-vars': ['error', {
				args: 'all',
				argsIgnorePattern: '^_',
				caughtErrors: 'all',
				caughtErrorsIgnorePattern: '^_',
				destructuredArrayIgnorePattern: '^_',
				varsIgnorePattern: '^_',
				ignoreRestSiblings: true
			}],
			'preserve-caught-error': ['off'], // Error cause requires ES2022, but this code targets ES5 (Nashorn/GraalJS)
			'comma-dangle': ['error', {
				arrays: 'ignore',
				objects: 'only-multiline',
				imports: 'only-multiline',
				exports: 'only-multiline',
				functions: 'ignore'
			}],
			indent: ['warn', 4], // Keep in sync with .editorconfig
			'max-len': ['error', 160, 2, {
				ignoreUrls: true,
				ignoreComments: true,
				ignoreRegExpLiterals: true,
				ignoreStrings: true,
				ignoreTemplateLiterals: true
			}],
			'no-cond-assign': ['error', 'except-parens'],
			'no-multi-spaces': ['off'],
			'no-tabs': ['off'],
			'no-underscore-dangle': ['error', {
				allow: [
					'__connection', // my own invention
					'_path', // node property
					'_id', // node property
					'_indexConfig', // node property
					'_inheritsPermissions', // node property
					'_name', // node property
					'_nodeType', // node property
					'_parentPath', // node create property
					'_permissions', // node property
					'_score', // custom query res property
					'_ts', // node property
					'_versionKey' // node property
				],
				allowAfterThis: true,
				allowAfterSuper: false,
				enforceInMethodNames: false
			}],
			'no-unexpected-multiline': 'off',
			'object-curly-newline': ['off'],
			'object-curly-spacing': ['off'],
			'prefer-rest-params': ['off'], // This rule should not be used in ES3/5 environments.
			semi: ['off'],
			'spaced-comment': ['off'],
			strict: 1
		} // rules
	},
]);
