// Since lib-explorer is typically a webpack external:
// Deleting the file won't result in a compiletime errors.
// Thus throwing useful runtime errors instead.

export function register() :void {
	throw new Error('collector/register was deprecated in lib-explorer-3.16.0 and was removed in lib-explorer-4.0.0, you must provide a src/main/resources/collectors.json'); // TODO Remove in lib-explorer-5.0.0
}
