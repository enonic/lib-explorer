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
import {progress as _progress} from '/lib/xp/task';


//──────────────────────────────────────────────────────────────────────────────
// Local libs (Absolute path without extension so it doesn't get webpacked)
//──────────────────────────────────────────────────────────────────────────────
import {currentTimeMillis} from '/lib/enonic/yase/time/currentTimeMillis';


//──────────────────────────────────────────────────────────────────────────────
// Public function
//──────────────────────────────────────────────────────────────────────────────
export function progress({
	current = undefined,
	total = undefined,
	info = {}
} = {}) {
	info.currentTime = currentTimeMillis(); // eslint-disable-line no-param-reassign
	if (!info.startTime) { info.startTime = info.currentTime; } // eslint-disable-line no-param-reassign
	return _progress({
		current,
		total,
		info: info ? JSON.stringify(info) : undefined
	});
}
