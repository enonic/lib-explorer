import { globSync } from 'glob';
// import { print } from 'q-i';
import { defineConfig, type Options } from 'tsup';


interface MyOptions extends Options {
	d?: string
}


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
// print(SERVER_FILES, { maxItems: Infinity });


export default defineConfig((options: MyOptions) => {
	// print(options, { maxItems: Infinity });
	if (options.d === 'build/resources/main') {
		return {
			entry: SERVER_FILES,
			esbuildOptions(options, context) {
				options.banner = {
					js: `const globalThis = (1, eval)('this');` // buffer polyfill needs this
				};
				options.chunkNames = 'lib/explorer/_chunks/[name]-[hash]'
			},
			external: [ // All these are available runtime in the jar file:
				'/lib/cache',
				/^\/lib\/explorer/,
				/^\/lib\/guillotine/,
				'/lib/graphql',
				'/lib/graphql-connection',
				'/lib/http-client',
				'/lib/router',
				'/lib/util',
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
			format: 'cjs',
			inject: [
				// TODO: Maybe use this instead?
				//'node_modules/core-js/stable/global-this.js',

				// Not needed?
				// 'node_modules/core-js/stable/array/flat.js',

				// This works, but might not be needed, because I'm using arrayIncludes from @enonic/js-utils
				// 'node_modules/core-js/stable/array/includes.js',

				// Needed by pretty-ms, which I'm not using anymore
				// 'node_modules/core-js/stable/math/trunc.js',

				// Needed by pretty-ms, which I'm not using anymore
				// 'node_modules/core-js/stable/number/is-finite.js',

				// Needed by set-value, but imported locally
				// 'node_modules/core-js/stable/number/is-integer.js',

				// Not needed?
				// 'node_modules/core-js/stable/parse-float.js',

				// Needed by set-value, but imported locally
				// 'node_modules/core-js/stable/reflect/index.js',
			],
			'main-fields': 'main,module',
			minify: false, // Minifying server files makes debugging harder
			noExternal: [ // TODO: These might need Polyfills for global to run in Nashorn:
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
			],
			platform: 'neutral',

			// https://tsup.egoist.dev/#code-splitting
			// Code splitting currently only works with the esm output format,
			// and it's enabled by default.
			// If you want code splitting for cjs output format as well, try
			// using --splitting flag which is an experimental feature to get
			// rid of the limitation in esbuild.
			splitting: true, // I don't think this works, the error messages at runtime are useless

			shims: false, // https://tsup.egoist.dev/#inject-cjs-and-esm-shims
			sourcemap: false,

			// https://tsup.egoist.dev/#tree-shaking
			// Tree shaking
			// esbuild has tree shaking enabled by default, but sometimes it's
			// not working very well, see #1794 #1435, so tsup offers an
			// additional option to let you use Rollup for tree shaking instead
			// This option has the same type as the treeshake option in Rollup:
			// https://rollupjs.org/configuration-options/#treeshake
			// treeshake: true // This fails after 1m 19s

			tsconfig: 'src/main/resources/tsconfig.json',
		};
	}
	throw new Error(`Unconfigured directory:${options.d}!`)
})
