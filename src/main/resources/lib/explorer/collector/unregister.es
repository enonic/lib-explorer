// Since lib-explorer is typically a webpack external:
// Deleting the file won't result in a compiletime errors.
// Thus throwing useful runtime errors instead.

export function unregister() {
	log.warning('collector/unregister was deprecated in lib-explorer-4.0.0, you must provide a src/main/resources/collectors.json'); // TODO Throw error in lib-explorer-5.0.0 and remove in lib-explorer-6.0.0
}
