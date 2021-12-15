import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';


export default {
	//input: 'build/tsc/lib/explorer/index.js',
	input: 'build/swc/main/resources/lib/explorer/index.js',
	output: {
		//dir: '',
		file: 'build/rollup/index.mjs',
		format: 'esm'
	},
	plugins: [
		nodeResolve({
			resolveOnly: ['@enonic/js-utils']
		}),
		commonjs()
	]
};
