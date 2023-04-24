import { globSync } from 'glob';
// import { print } from 'q-i';
import { defineConfig, type Options } from 'tsup';


interface MyOptions extends Options {
	d?: string
}


const RESOURCES_PATH = 'src/main/resources';


const SERVER_FILES = globSync(
	`${RESOURCES_PATH}/**/*.ts`,
	{
		absolute: false,
		ignore: globSync(`${RESOURCES_PATH}/**/*.d.ts`)
	}
);
// print(SERVER_FILES, { maxItems: Infinity });


export default defineConfig((options: MyOptions) => {
	// print(options, { maxItems: Infinity });
	if (options.d === 'build/resources/main') {
		return {
			entry: SERVER_FILES,
			external: [ // All these are available runtime in the jar file:
				'/lib/cache',
				/^\/lib\/guillotine/,
				'/lib/graphql',
				'/lib/graphql-connection',
				'/lib/http-client',
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
			'main-fields': 'main,module',
			minify: false, // Minifying server files makes debugging harder
			noExternal: [ // TODO: These might need Polyfills for global to run in Nashorn:
				'@enonic/explorer-utils', // several places
				'@enonic/fnv-plus', // src/main/resources/lib/explorer/string/hash.ts
				'@enonic/js-utils', // many places
				'd3-dsv', // src/main/resources/lib/explorer/parseCsv.ts
				'deep-object-diff', // several places
				'diff', // src/main/resources/lib/explorer/_uncoupled/document/documentUnchanged.ts
				'fast-deep-equal', // several places
				'human-object-diff', // several places
				'traverse', // many places
				'uri-js', // src/main/resources/lib/explorer/url/normalize.ts resolve.ts
			],
			platform: 'neutral',

			// https://tsup.egoist.dev/#code-splitting
			// Code splitting currently only works with the esm output format,
			// and it's enabled by default.
			// If you want code splitting for cjs output format as well, try
			// using --splitting flag which is an experimental feature to get
			// rid of the limitation in esbuild.
			splitting: true,

			shims: false, // https://tsup.egoist.dev/#inject-cjs-and-esm-shims
			sourcemap: false,
			target: 'es5'
		};
	}
	throw new Error(`Unconfigured directory:${options.d}!`)
})
