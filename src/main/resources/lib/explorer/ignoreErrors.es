export function ignoreErrors(fn) {
	let rv;
	try {
		rv = fn();
	} catch (e) {
		// no-op we don't want to log anything here
	}
	return rv;
}
