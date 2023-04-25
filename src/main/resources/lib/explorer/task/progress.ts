import type {AnyObject} from '../../../types/index.d';

//──────────────────────────────────────────────────────────────────────────────
// Polyfill
//──────────────────────────────────────────────────────────────────────────────
/*if (Number.isFinite === undefined) { // Needed by pretty-ms
	Number.isFinite = value => typeof value === 'number' && isFinite(value); // eslint-disable-line no-restricted-globals
}*/
/* eslint-disable import/first */
/*import mathTrunc from 'math-trunc';

if (!Math.trunc) { Math.trunc = mathTrunc; } // Needed by pretty-ms
*/

//──────────────────────────────────────────────────────────────────────────────
// Enonic XP libs (externals not webpacked)
//──────────────────────────────────────────────────────────────────────────────
//@ts-ignore
import {progress as _progress} from '/lib/xp/task';

// This fails when tsup code splitting: true
// import {currentTimeMillis} from '../time/currentTimeMillis';


//@ts-ignore
const {currentTimeMillis} = Java.type('java.lang.System') as {
	currentTimeMillis: () => number
}


export interface Progress<Info extends AnyObject = {
	currentTime?: number
	name?: string
	message?: string
	startTime?: number
	uri?: string
}> {
	current?: number
	total?: number
	info?: Info
}

//──────────────────────────────────────────────────────────────────────────────
// Public function
//──────────────────────────────────────────────────────────────────────────────
export function progress({
	current = undefined,
	total = undefined,
	info = {}
} : Progress = {}) {
	info.currentTime = currentTimeMillis(); // eslint-disable-line no-param-reassign
	if (!info.startTime) { info.startTime = info.currentTime; } // eslint-disable-line no-param-reassign
	return _progress({
		current,
		total,
		info: info ? JSON.stringify(info) : undefined
	});
}
