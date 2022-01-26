import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
//import typescript from '@rollup/plugin-typescript';
import typescript from 'rollup-plugin-typescript2';


export default {
	input: 'src/main/typeScript/lib/explorer/index.ts',
	//input: 'build/tsc/lib/explorer/index.js',
	//input: 'build/swc/src/main/resources/lib/explorer/index.js',
	output: {
		//inlineDynamicImports: true,
		//dir: '',

		file: 'build/rollup/index.js',
		format: 'cjs'

		//file: 'build/rollup/index.mjs',
		//format: 'esm'
	},
	plugins: [
		nodeResolve({
			resolveOnly: ['@enonic/js-utils']
		}),
		typescript(),
		commonjs()
	]
};
