/* eslint-disable no-console */
import path from 'path';
import TerserPlugin from 'terser-webpack-plugin';
import {webpackServerSideJs} from '@enonic/webpack-server-side-js'

// const toStr = v => JSON.stringify(v, null, 4);

//const MODE = 'development';
const MODE = 'production';

const SS_ALIAS = {};

const SS_EXTERNALS = [
	'/lib/cache',
	'/lib/cron',
	'/lib/http-client',
	'/lib/license',
	/^\/lib\/xp\//,
	// Avoid bundling and transpile library files seperately:
	/^\/lib\/explorer\//
];

if (MODE === 'production') {
	SS_EXTERNALS.push('/lib/util');
	SS_EXTERNALS.push(/^\/lib\/util\//);
} else {
	SS_ALIAS['/lib/util'] = path.resolve(__dirname, '../lib-util/src/main/resources/lib/util/');
}

const WEBPACK_CONFIG = [
	webpackServerSideJs({
		__dirname: __dirname,
		externals: SS_EXTERNALS,
		mode: MODE,
		optimization: {
			minimizer: [
				new TerserPlugin(/*{
					terserOptions: {
						compress: {}
						//mangle: true // This will DESTROY exports!
					}
				}*/)
			]
		},
		resolveAlias: SS_ALIAS
	})
];
//console.log(`WEBPACK_CONFIG:${toStr(WEBPACK_CONFIG)}`);
//process.exit();

export { WEBPACK_CONFIG as default };
