// Since lib-explorer is typically a webpack external:
// Deleting the file won't result in a compiletime errors.
// Thus throwing useful runtime errors instead.


export function getCollectors() {
	throw new Error('collection/reschedule/getCollectors was deprecated in lib-explorer-3.17.0 and was removed in lib-explorer-4.0.0!'); // TODO Remove in lib-explorer-5.0.0
}


export function reschedule() {
	throw new Error('collection/reschedule was deprecated in lib-explorer-3.17.0 and was removed in lib-explorer-4.0.0!'); // TODO Remove in lib-explorer-5.0.0
}
