export function logErrors<
	ReturnValue
>(
	fn :() => ReturnValue
) :ReturnValue {
	try {
		return fn();
	} catch (e) {
		log.error(`${e.class.name} ${e.message}`, e);
	}
}
