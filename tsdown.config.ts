import { transform } from '@swc/core';
import { globSync } from 'glob';
import { defineConfig } from 'tsdown';


const DIR_SRC = 'src/main/resources';
const AND_BELOW = '**';
const SOURCE_FILES = '*.ts';
const TEST_EXT = `{spec,test}.{ts,tsx}`;
const TEST_FILES = `*.${TEST_EXT}`;
const TYPE_FILES = '*.d.ts';


const SERVER_FILES = globSync(
	`${DIR_SRC}/${AND_BELOW}/${SOURCE_FILES}`,
	{
		absolute: false,
		ignore: globSync(`${DIR_SRC}/${AND_BELOW}/${TYPE_FILES}`)
			.concat(globSync(`${DIR_SRC}/${AND_BELOW}/${TEST_FILES}`))
	}
);

const BUNDLED_PACKAGES = [ // TODO: These might need Polyfills for global to run in Nashorn:
	'@enonic/explorer-utils', // several places
	'@enonic/fnv-plus', // lib/explorer/string/hash.ts
	'@enonic/js-utils', // many places
	'core-js', // lib/explorer/interface/graphql/mergeFields.ts
	'd3-dsv', // lib/explorer/parseCsv.ts
	'deep-object-diff', // several places
	'diff', // lib/explorer/_uncoupled/document/documentUnchanged.ts
	'fast-deep-equal', // several places
	'human-object-diff', // several places
	'set-value', // lib/explorer/interface/graphql/mergeFields.ts
	'traverse', // many places
	'uri-js', // lib/explorer/url/normalize.ts resolve.ts
];


export default defineConfig({
	entry: SERVER_FILES,
	root: DIR_SRC,
	outDir: 'build/resources/main',
	cjsDefault: false,
	clean: false,
	deps: {
		neverBundle: [ // All these are available runtime in the jar file:
			'/lib/cache',
			/^\/lib\/explorer/,
			/^\/lib\/guillotine/,
			'/lib/graphql',
			'/lib/graphql-connection',
			'/lib/http-client',
			'/lib/router',
			'/lib/vanilla',
			'/lib/thymeleaf',
			'/lib/xp/admin',
			'/lib/xp/app',
			'/lib/xp/auditlog',
			'/lib/xp/auth',
			'/lib/xp/cluster',
			'/lib/xp/common',
			'/lib/xp/content',
			'/lib/xp/context',
			'/lib/xp/event',
			'/lib/xp/export',
			'/lib/xp/grid',
			'/lib/xp/i18n',
			'/lib/xp/io',
			'/lib/xp/mail',
			'/lib/xp/node',
			'/lib/xp/portal',
			'/lib/xp/project',
			'/lib/xp/repo',
			'/lib/xp/scheduler',
			'/lib/xp/schema',
			'/lib/xp/task',
			'/lib/xp/value',
			'/lib/xp/vhost',
			'/lib/xp/websocket',
		],
		alwaysBundle: (id) => BUNDLED_PACKAGES.some((name) => id === name || id.startsWith(`${name}/`)),
	},
	dts: false,
	fixedExtension: false,
	format: 'cjs',
	inputOptions: {
		// tsdown forces platform node for cjs, which would externalize node builtins like util
		platform: 'neutral',
		resolve: {
			mainFields: ['browser', 'module', 'main'],
		},
	},
	minify: false, // Minifying server files makes debugging harder
	outputOptions: {
		chunkFileNames: 'lib/explorer/_chunks/[name]-[hash].js',
		intro: `var globalThis = (1, eval)('this');`, // buffer polyfill needs this
		esModule: true,
		generatedCode: {
			symbols: false,
		},
	},
	platform: 'neutral',
	plugins: [{
		// Rolldown can't lower to ES5, which Nashorn needs, so swc does it per chunk (same as tsup did)
		name: 'swc-es5',
		async renderChunk(code, chunk) {
			const result = await transform(code, {
				filename: chunk.fileName,
				sourceMaps: false,
				jsc: {
					target: 'es5',
					parser: {
						syntax: 'ecmascript',
					},
				},
				module: {
					type: 'commonjs',
				},
			});
			return { code: result.code, map: null };
		},
	}],
	shims: false,
	sourcemap: false,
	target: 'es2020',
	tsconfig: `${DIR_SRC}/tsconfig.json`,
});
