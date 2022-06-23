// Rollup itself only understands ES modules.
// So if you tell typescript to produce CJS modules,
// then that's not going to work.


import alias from '@rollup/plugin-alias';
import commonjs from '@rollup/plugin-commonjs'; // Convert CommonJS modules to ES6, so they can be included in a Rollup bundle
import { nodeResolve } from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
//import typescript from 'rollup-plugin-typescript2';


export default {
	external: [
		'/lib/xp/auth',
		'/lib/xp/context',
		'/lib/xp/common',
		'/lib/xp/event',
		'/lib/xp/mail',
		'/lib/xp/node',
		'/lib/xp/repo',
		'/lib/xp/task',
		'/lib/xp/value',
	],
	input: {
		//'src/main/resources/lib/explorer/index': 'src/main/resources/lib/explorer/index.ts',
		//'src/main/resources/lib/explorer/_uncoupled/index': 'src/main/resources/lib/explorer/_uncoupled/index.ts',
		'index': 'src/main/resources/lib/explorer/_uncoupled/index.ts',
	},
	//input: 'build/tsc/src/main/resources/lib/explorer/index.js', // Not TypeScript
	//input: 'build/swc/src/main/resources/lib/explorer/index.js',
	output: {
		chunkFileNames: '[name].js',

		// [!] (plugin typescript) Error: @rollup/plugin-typescript: Path of Typescript compiler option 'outDir' must be located inside Rollup 'dir' option.
		dir: 'build/rollup',

		//inlineDynamicImports: true,
		//file: 'build/rollup/index.js',
		//file: 'build/rollup/index.mjs',
		format: 'cjs',
		//format: 'esm'
		freeze: false,
		interop: false,

		// Actually still using webpack to build before making the jar file, so this is pointless so far:
		//preserveModules: true, // Copy modules into build/resources/main/node_modules instead of bundling them

		sourcemap: false
	},
	plugins: [
		alias({
			entries: [
				//{ find: '@enonic/js-utils'        , replacement: 'node_modules/@enonic/js-utils/src' },
				//{ find: '/lib/explorer'           , replacement: 'src/main/resources/lib/explorer' },
				//{ find: '/lib/explorer-typescript', replacement: 'src/main/typeScript/lib/explorer' },
				{ find: 'fast-deep-equal'         , replacement: 'node_modules/fast-deep-equal/index.js' },
				{ find: 'humanize-string'         , replacement: 'node_modules/humanize-string/index.js' },
				{ find: 'titleize'                , replacement: 'node_modules/titleize/index.js' },
				{ find: 'date-fns/format'         , replacement: 'node_modules/date-fns/format/index.js' }
			]
		}),
		nodeResolve({
			/*dedupe: [
				'/lib/xp/node'
			]*/
			//jail: './node_modules/'
			//moduleDirectories: [
			//	'build/tsc/src/main/resources',
			//	'node_modules'
			//],
			//modulesOnly: true, // If true, inspect resolved files to assert that they are ES2015 modules.
			preferBuiltins: false//,
			// An Array which instructs the plugin to limit module resolution to
			// those whose names match patterns in the array. Note: Modules not
			// matching any patterns will be marked as external.
			/*resolveOnly: [
				//'@enonic/fnv-plus',
				'@enonic/js-utils',
				//'deep-object-diff',
				'diff',
				'fast-deep-equal',
				//'human-object-diff',
				'traverse',

				//'/lib/explorer',
				//'/lib/explorer-typescript'
				/^\/lib\/explorer.*$/
			]*/
		}),
		typescript(),
		commonjs() // Convert CommonJS modules to ES6, so they can be included in a Rollup bundle
	]
};
