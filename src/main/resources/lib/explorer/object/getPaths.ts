// import {toStr} from '@enonic/js-utils/value/toStr';
//import traverse from 'traverse'; //[!] Error: 'default' is not exported by node_modules/traverse/index.js
//import * as traverse from 'traverse';

// @ts-ignore Import assignment cannot be used when targeting ECMAScript modules.
import traverse = require('traverse');


export function getPaths(obj) {
	// log.debug('getPaths obj:%s', toStr(obj));
	const paths = traverse(obj).paths();
	// log.debug('getPaths paths:%s', toStr(paths));
	return paths;
}
