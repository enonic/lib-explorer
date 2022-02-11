//import traverse from 'traverse'; //[!] Error: 'default' is not exported by node_modules/traverse/index.js
//import * as traverse from 'traverse';
const traverse = require('traverse');


export function getPaths(obj) {
	return traverse(obj).paths();
}
