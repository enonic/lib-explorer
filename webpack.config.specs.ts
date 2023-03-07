import * as esbuild from 'esbuild'; // Use the installed esbuild, rather than the one shipped with esbuild-loader
//import {globSync} from 'glob';
import * as path from 'path';
import * as webpack from 'webpack';
import { ESBuildMinifyPlugin } from 'esbuild-loader';
// in case you run into any typescript error when configuring `devServer`
import 'webpack-dev-server';


//const MODE = 'development';
const MODE = 'production';

const SRC_DIR = 'src/main/resources';

const ESBUILD_TARGET = 'es2015';

//const SPEC_EXTENSION_GLOB_BRACE = '*.spec.{ts}';
//const ENTRY_SPEC_FILES = globSync(`${SRC_DIR}/**/${SPEC_EXTENSION_GLOB_BRACE}`);

/*const dict = (arr :string[]) :object => Object.assign(
	//@ts-ignore
	...arr.map(
		//@ts-ignore
		([k, v]) => ({ [k]: v })
	)
);

const entry = dict(ENTRY_SPEC_FILES.map(k => [
	k.replace(`${SRC_DIR}/`, '').replace(/\.[^.]*$/, ''), // name
	`.${k.replace(`${SRC_DIR}`, '')}` // source relative to context
]));*/

const entry = {
	'lib/explorer/document/cleanData.spec': './lib/explorer/document/cleanData.spec.ts'
}

//console.log('entry', entry);

const config: webpack.Configuration = {
	context: path.resolve(__dirname, SRC_DIR),
	devtool: false, // Don't waste time generating sourceMaps
	mode: MODE,
	//@ts-ignore
	entry,
	externals: [
		//'@enonic/js-utils'
	],
	module: {
	    rules: [{
			test: /\.ts$/,
			loader: 'esbuild-loader',
			options: {
				implementation: esbuild, // Use the installed esbuild, rather than the one shipped with esbuild-loader
				loader: 'ts',
				target: ESBUILD_TARGET,
				tsconfigRaw: require('./tsconfig.specs.json')
			}
		}/*{ // Didn't work on typescript files, maybe just missing config options
			test: /\.ts$/,
            exclude: /(node_modules|bower_components)/,
            use: {
                // Use `.swcrc` to configure swc
                loader: 'swc-loader'
            }
        }*/]
	},
	optimization: {
		minimize: MODE === 'production',
		minimizer: MODE === 'production' ? [
			new ESBuildMinifyPlugin({
				target: ESBUILD_TARGET
			})
		] : []
	},
	output: {
		filename: '[name].js',
		libraryTarget: 'commonjs',
		path: path.resolve(__dirname, 'build/webpack/specs')
	},
	plugins: [
		/*new webpack.ProvidePlugin({
			//'@enonic/js-utils': path.resolve(__dirname, './node_modules/@enonic/js-utils/src')
			'@enonic/js-utils': path.resolve(__dirname, './node_modules/@enonic/js-utils/dist/esm/index.mjs')
			//'@enonic/js-utils': path.resolve(__dirname, './node_modules/@enonic/js-utils/dist/cjs/index.js')
		})*/
	],
	performance: {
		hints: false
	},
	resolve: {
		alias: {
			//'@enonic/js-utils': path.resolve(__dirname, './node_modules/@enonic/js-utils/src')
			'@enonic/js-utils': path.resolve(__dirname, './node_modules/@enonic/js-utils/dist/esm/index.mjs')
			//'@enonic/js-utils': path.resolve(__dirname, './node_modules/@enonic/js-utils/dist/cjs/index.js')
		},
		extensions: [
			'ts',
			'js' // Needed by node_modules/assert
		].map(ext => `.${ext}`)
	},
	stats: {
		colors: true,
		hash: false,
		modules: false,
		moduleTrace: false,
		timings: false,
		version: false
	}
};

export default config;
