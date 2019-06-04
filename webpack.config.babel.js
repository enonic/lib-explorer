/* eslint-disable no-console */
//──────────────────────────────────────────────────────────────────────────────
// Imports
//──────────────────────────────────────────────────────────────────────────────
import glob from 'glob';
import path from 'path';
//import {CleanWebpackPlugin} from 'clean-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
//import MiniCssExtractPlugin from 'mini-css-extract-plugin';
//import postcssPresetEnv from 'postcss-preset-env';
import UglifyJsPlugin from 'uglifyjs-webpack-plugin'; // Supports ECMAScript2015

import {webpackEsmAssets} from '@enonic/webpack-esm-assets'
import {webpackServerSideJs} from '@enonic/webpack-server-side-js'
import {webpackStyleAssets} from '@enonic/webpack-style-assets'

//──────────────────────────────────────────────────────────────────────────────
// Functions
//──────────────────────────────────────────────────────────────────────────────
const toStr = v => JSON.stringify(v, null, 4);
const dict = arr => Object.assign(...arr.map(([k, v]) => ({ [k]: v })));


//──────────────────────────────────────────────────────────────────────────────
// Constants
//──────────────────────────────────────────────────────────────────────────────
const MODE = 'development';
//const MODE = 'production';

const SRC_DIR = 'src/main/resources';
const SRC_DIR_ABS = path.resolve(__dirname, SRC_DIR);
const SRC_ASSETS_DIR_ABS = path.resolve(SRC_DIR_ABS, 'assets');

const DST_DIR = 'build/resources/main';
const DST_DIR_ABS = path.join(__dirname, DST_DIR);
const DST_ASSETS_DIR_ABS = path.join(DST_DIR_ABS, 'assets');


const STATS = {
	colors: true,
	hash: false,
	maxModules: 0,
	modules: false,
	moduleTrace: false,
	timings: false,
	version: false
};

const CLIENT_JS_CONFIG = {
	context: SRC_ASSETS_DIR_ABS,
	entry: './react/index.jsx',
	externals: [
		//'react'
	],
	devtool: false, // Don't waste time generating sourceMaps
	mode: MODE,
	module: {
		rules: [{
			test: /\.jsx$/,
			exclude: /node_modules/,
			use: [{
				loader: 'babel-loader',
				options: {
					babelrc: false, // The .babelrc file should only be used to transpile config files.
					comments: false,
					compact: false,
					minified: false,
					plugins: [
						'@babel/plugin-proposal-class-properties',
						'@babel/plugin-proposal-object-rest-spread',
						'@babel/plugin-syntax-dynamic-import',
						'@babel/plugin-syntax-throw-expressions',
						'@babel/plugin-transform-object-assign',
						['@babel/plugin-transform-runtime', {
				      		regenerator: true
				    	}],
						'array-includes'
					],
					presets: [
						'@babel/preset-env',
						'@babel/preset-react'
					]
				} // options
			}]
		}]
	},
	optimization: {
		minimizer: [
			new UglifyJsPlugin({
				parallel: true, // highly recommended
				sourceMap: false/*,
				uglifyOptions: {
					mangle: false, // default is true?
					keep_fnames: true // default is false?
				}*/
			})
		]
	},
	output: {
		//filename: '[name].js',
		filename: 'yase.js',
		library: 'yase',
		libraryTarget: 'umd',
		path: DST_ASSETS_DIR_ABS
	},
	performance: {
		hints: false
	},
	plugins: [
		new CopyWebpackPlugin([
			//{ from: 'babel-standalone/', to: 'babel-standalone/' },
			{ from: 'formik/dist/formik.umd*', to: 'formik/[name].[ext]' },
			{ from: 'jquery/dist', to: 'jquery'},
			{ from: 'react/umd/react.*.js', to: 'react/[name].[ext]' },
			{ from: 'react-dom/umd/react-dom.*.js', to: 'react-dom/[name].[ext]' },
			{ from: 'semantic-ui/dist', to: 'semantic-ui'}
			//{ from: 'redux/dist/', to: 'redux/' }
		], {
			context: path.resolve(__dirname, 'node_modules')
		}),
		new CopyWebpackPlugin([
			{ from: 'js', to: 'js'}
		], {
			context: path.resolve(__dirname, SRC_DIR, 'assets')
		})
	],
	resolve: {
		extensions: ['.es', '.js', '.jsx']
	},
	stats: STATS
};
//console.log(`CLIENT_JS_CONFIG:${toStr(CLIENT_JS_CONFIG)}`); process.exit();


//──────────────────────────────────────────────────────────────────────────────

const WEBPACK_CONFIG = [
	webpackServerSideJs({
		__dirname: __dirname,
		externals: [
			/^\//
			/*'/lib/cache',
			'/lib/cron',
			'/lib/http-client',
			'/lib/util',
			'/lib/util/data',
			'/lib/util/object',
			'/lib/util/value',
			'/lib/xp/admin',
			'/lib/xp/auth',
			'/lib/xp/common',
			'/lib/xp/context',
			'/lib/xp/i18n',
			'/lib/xp/node',
			'/lib/xp/portal',
			'/lib/xp/repo',
			'/lib/xp/task',
			'/lib/xp/value'*/
		],
		mode: MODE
	}),
	webpackStyleAssets({
		__dirname,
		mode: MODE
	}),
	CLIENT_JS_CONFIG,
	webpackEsmAssets({
		__dirname: __dirname,
		assetFiles: [
			'src/main/resources/assets/react/Collection.jsx',
			'src/main/resources/assets/react/Interfaces.jsx'
		],
		mode: MODE,
		stats: STATS
	})
];
//console.log(`WEBPACK_CONFIG:${toStr(WEBPACK_CONFIG)}`);
//process.exit();

export { WEBPACK_CONFIG as default };
