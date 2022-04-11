import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
//import typescript from '@rollup/plugin-typescript';
import typescript from 'rollup-plugin-typescript2';


export default {
	output: {
		format: 'cjs'
	},
	plugins: [
		nodeResolve({
			preferBuiltins: true, // Avoid warning
			//resolveOnly: ['@enonic/js-utils']
		}),
		typescript(),
		commonjs()
	]
};
