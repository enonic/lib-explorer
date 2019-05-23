//──────────────────────────────────────────────────────────────────────────────
// Enonic XP libs (externals not webpacked)
//──────────────────────────────────────────────────────────────────────────────
//import {toStr} from '/lib/util';
import {sanitize} from '/lib/xp/common';


//──────────────────────────────────────────────────────────────────────────────
// Local libs (Absolute path without extension so it doesn't get webpacked)
//──────────────────────────────────────────────────────────────────────────────
import {connect} from '/lib/explorer/repo/connect';


//──────────────────────────────────────────────────────────────────────────────
// Public function
//──────────────────────────────────────────────────────────────────────────────
export function exists({
	connection, // Connecting many places leeds to loss of control over principals, so pass a connection around.
	_path = '/',
	_name
}) {
	const queryParams = {
		count: 0,
		query: `_path = '${_path}${sanitize(_name)}'`//, // NOTE May already be sanitized
		//filters:
	}; //log.info(toStr({queryParams}));
	const result = connection.query(queryParams); //log.info(toStr({result}));
	return result.total;
}
