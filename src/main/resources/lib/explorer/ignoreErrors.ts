export function ignoreErrors<
	ReturnValue
>(
	fn :() => ReturnValue
) :ReturnValue {
	let rv :ReturnValue;
	try {
		rv = fn();
	} catch (e) {
		// no-op we don't want to log anything here
	}
	return rv;
}
