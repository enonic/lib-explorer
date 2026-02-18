//──────────────────────────────────────────────────────────────────────────────
// Polyfill
//──────────────────────────────────────────────────────────────────────────────
/*if (Number.isFinite === undefined) { // Needed by pretty-ms
	Number.isFinite = value => typeof value === 'number' && isFinite(value); // eslint-disable-line no-restricted-globals
}*/
/*import mathTrunc from 'math-trunc';

if (!Math.trunc) { Math.trunc = mathTrunc; } // Needed by pretty-ms
*/

//──────────────────────────────────────────────────────────────────────────────
// Enonic XP libs (externals not webpacked)
//──────────────────────────────────────────────────────────────────────────────
import { progress as _progress } from '/lib/xp/task';
import type { TaskProgressParams } from '../types.d';

// This fails when tsup code splitting: true
// import {currentTimeMillis} from '/lib/explorer/time/currentTimeMillis';


//@ts-ignore
const { currentTimeMillis } = Java.type('java.lang.System') as {
	currentTimeMillis: () => number;
}

//──────────────────────────────────────────────────────────────────────────────
// Public function
//──────────────────────────────────────────────────────────────────────────────
export function progress({
	current = undefined,
	total = undefined,
	info = {}
}: TaskProgressParams = {}) {
	info.currentTime = currentTimeMillis(); // eslint-disable-line no-param-reassign
	if (!info.startTime) { info.startTime = info.currentTime; } // eslint-disable-line no-param-reassign
	return _progress({
		current,
		total,
		info: info ? JSON.stringify(info) : undefined
	});
}
