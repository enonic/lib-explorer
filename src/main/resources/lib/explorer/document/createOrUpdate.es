import {create} from '/lib/explorer/document/create';
import {update} from '/lib/explorer/document/update';
import {toStr} from '/lib/util';


const CATCH_CLASS_NAMES = [
	'com.enonic.xp.node.NodeIdExistsException',
	'com.enonic.xp.node.NodeAlreadyExistAtPathException'
];


export function createOrUpdate({
	// Remove from ...rest since not param to create
	__boolPartial = false,

	// These exist in rest and are common to both create and update
	//__boolRequireValid
	//__connection
	//_name
	//_id, // NOTE Required by update
	//document_metadata

	...rest
}) {
	let rv;
	try {
		rv = create({
			...rest
		});
	} catch (catchedError) {
		if (catchedError.class && CATCH_CLASS_NAMES.includes(catchedError.class.name)) {
			rv = update({
				__boolPartial, ...rest
			});
		} else {
			if (catchedError.class) {
				log.error(toStr({catchedErrorClassName: catchedError.class.name}), catchedError);
			}
			log.error(toStr({catchedErrorMessage: catchedError.message}), catchedError);
			throw catchedError;
		}
	}
	//log.debug(toStr({createOrUpdate: rv}));
	return rv;
}
