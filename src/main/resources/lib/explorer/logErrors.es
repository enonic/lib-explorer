export function logErrors(fn) {
	try {
		return fn();
	} catch (e) {
		log.error(`${e.class.name} ${e.message}`, e);
	}
}
