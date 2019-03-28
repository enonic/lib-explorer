import {toStr} from '/lib/enonic/util';

//──────────────────────────────────────────────────────────────────────────────
// Local libs (Absolute path without extension so it doesn't get webpacked)
//──────────────────────────────────────────────────────────────────────────────
import {BRANCH_ID, REPO_ID} from '/lib/enonic/yase/constants';
import {connect} from '/lib/enonic/yase/repo/connect';
import {create} from '/lib/enonic/yase/node/create';
import {modify} from '/lib/enonic/yase/node/modify';


const CATCH_CLASS_NAMES = [
	'com.enonic.xp.node.NodeIdExistsException',
	'com.enonic.xp.node.NodeAlreadyExistAtPathException'
];


export function createOrModify({
	__repoId = REPO_ID,
	__branch = BRANCH_ID,
	__connection = connect({
		repoId: __repoId,
		branch: __branch
	}),
	_parentPath = '/',
	//_path = '/',
	_name,
	displayName = Array.isArray(_name)
		? _name.join(', ')
		: _name,
	...rest
} = {}) {
	/*log.info(toStr({
		_parentPath, _name, displayName, rest
	}));*/
	let rv;
	try {
		rv = create({
			__connection, _parentPath, _name, displayName, ...rest
		});
	} catch (catchedError) {
		if (CATCH_CLASS_NAMES.includes(catchedError.class.name)) {
			rv = modify({
				__connection, _parentPath, _name, displayName, ...rest
			});
		} else {
			log.error(toStr({catchedErrorClassName: catchedError.class.name}));
			throw catchedError;
		}
	}
	//log.info(toStr({createOrModifyNodeRv: rv}));
	return rv;
}
