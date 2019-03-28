//──────────────────────────────────────────────────────────────────────────────
// Enonic XP libs (externals not webpacked)
//──────────────────────────────────────────────────────────────────────────────
//import {toStr} from '/lib/enonic/util';
import {sanitize} from '/lib/xp/common';


//──────────────────────────────────────────────────────────────────────────────
// Local libs (Absolute path without extension so it doesn't get webpacked)
//──────────────────────────────────────────────────────────────────────────────
import {connect} from '/lib/enonic/yase/repo/connect';


//──────────────────────────────────────────────────────────────────────────────
// Public function
//──────────────────────────────────────────────────────────────────────────────
export function exists({
	repoId,
	branch = 'master',
	connection = connect({
		repoId,
		branch
	}),
	_path = '/',
	_name
}) {
	//log.info(toStr({repoId, branch}));
	const queryParams = {
		count: 0,
		query: `_path = '${_path}${sanitize(_name)}'`//, // NOTE May already be sanitized
		//filters:
	}; //log.info(toStr({queryParams}));
	const result = connection.query(queryParams); //log.info(toStr({result}));
	return result.total;
}
