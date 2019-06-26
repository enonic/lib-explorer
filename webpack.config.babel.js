/* eslint-disable no-console */
import path from 'path';
import TerserPlugin from 'terser-webpack-plugin';
import {webpackServerSideJs} from '@enonic/webpack-server-side-js'

// const toStr = v => JSON.stringify(v, null, 4);

//const MODE = 'development';
const MODE = 'production';

const WEBPACK_CONFIG = [
	webpackServerSideJs({
		__dirname: __dirname,
		externals: [
			//^\//

			'/lib/cache',
			'/lib/cron',
			/^\/lib\/explorer/,
			'/lib/http-client',

			'/lib/util',
			/^\/lib\/util\//,
			//'/lib/util/data',
			//'/lib/util/object',
			//'/lib/util/value',

			/^\/lib\/xp\//,
			/*'/lib/xp/admin',
			'/lib/xp/auth',
			'/lib/xp/common',
			'/lib/xp/content', // Used in lib-util
			'/lib/xp/context',
			'/lib/xp/i18n',
			'/lib/xp/node',
			'/lib/xp/portal',
			'/lib/xp/repo',
			'/lib/xp/task',
			'/lib/xp/value'*/
		],
		mode: MODE,
		optimization: {
			minimizer: [
				new TerserPlugin({
					terserOptions: {
						compress: {},
						mangle: true // Note `mangle.properties` is `false` by default.
					}
				})
			]
		},
		resolveAlias: {
			//'fnv-plus': path.resolve(__dirname, '../../tjwebb/fnv-plus/index.js')
			//'/lib/explorer': path.join(__dirname, 'src/main/resources/lib/explorer/'),
			//'/lib/util': path.resolve(__dirname, '../lib-util/src/main/resources/lib/util')
		}
	})
];
//console.log(`WEBPACK_CONFIG:${toStr(WEBPACK_CONFIG)}`);
//process.exit();

export { WEBPACK_CONFIG as default };
