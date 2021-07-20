//import {toStr} from '@enonic/js-utils';


export function join(...paths) {
	//log.info(toStr({paths}));

	// Split the inputs into a list of path commands.
	let parts = [];
	for (let i = 0; i < paths.length; i += 1) {
		parts = parts.concat(paths[i].split('/'));
	}

	// Interpret the path commands to get the new resolved path.
	const newParts = [];
	for (let i = 0; i < parts.length; i += 1) {
		const part = parts[i];
		// Remove leading and trailing slashes
		// Also remove "." segments
		if (!part || part === '.') continue;
		// Interpret ".." to pop the last segment
		if (part === '..') newParts.pop();
		// Push new path segments.
		else newParts.push(part);
	}

	// Preserve the initial slash if there was one.
	if (parts[0] === '') newParts.unshift('');

	// Turn back into a single string path.
	return newParts.join('/') || (newParts.length ? '/' : '.');
}
