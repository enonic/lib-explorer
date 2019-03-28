import {toStr} from '/lib/enonic/util';
import {sanitize} from '/lib/xp/common';

//──────────────────────────────────────────────────────────────────────────────
// Local libs (Absolute path without extension so it doesn't get webpacked)
//──────────────────────────────────────────────────────────────────────────────
import {BRANCH_ID, REPO_ID} from '/lib/enonic/yase/constants';
import {connect} from '/lib/enonic/yase/repo/connect';


export function modify({
	__repoId = REPO_ID,
	__branch = BRANCH_ID,
	_id, // So it doesn't end up in rest.
	_parentPath = '/',
	_name,
	displayName = Array.isArray(_name)
		? _name.join(', ')
		: _name,
	...rest
} = {}) {
	log.info(toStr({__repoId}));
	const connection = connect({ // eslint-disable-line no-underscore-dangle
		repoId: __repoId,
		branch: __branch
	});
	//log.info(toStr({key, displayName, rest}));
	return connection.modify({
		key: `${_parentPath}/${sanitize(_name)}`, // TODO Use path join
		editor: (node) => {
			/* eslint-disable no-param-reassign */
			//node._timestamp = new Date(); // DOES NOT WORK?
			node.modifiedTime = new Date();
			node.displayName = displayName;
			//Object.entries(rest).forEach(([property, value]) => {
			Object.keys(rest).forEach((property) => {
				const value = rest[property];
				node[property] = value;
			});
			/* eslint-enable no-param-reassign */
			//log.info(toStr({node}));
			return node;
		}
	});
}
