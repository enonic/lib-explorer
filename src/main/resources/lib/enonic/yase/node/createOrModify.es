import {toStr} from '/lib/enonic/util';

//──────────────────────────────────────────────────────────────────────────────
// Local libs (Absolute path without extension so it doesn't get webpacked)
//──────────────────────────────────────────────────────────────────────────────
import {create} from '/lib/enonic/yase/node/create';
import {modify} from '/lib/enonic/yase/node/modify';


const CATCH_CLASS_NAMES = [
	'com.enonic.xp.node.NodeIdExistsException',
	'com.enonic.xp.node.NodeAlreadyExistAtPathException'
];


export function createOrModify({
	__connection, // Connecting many places leeds to loss of control over principals, so pass a connection around.
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
		if (catchedError.class && CATCH_CLASS_NAMES.includes(catchedError.class.name)) {
			rv = modify({
				__connection, _parentPath, _name, displayName, ...rest
			});
		} else {
			if (catchedError.class) {
				log.error(toStr({catchedErrorClassName: catchedError.class.name}));
			}
			log.error(toStr({catchedErrorMessage: catchedError.message}));
			throw catchedError;
		}
	}
	//log.info(toStr({createOrModifyNodeRv: rv}));
	return rv;
}
