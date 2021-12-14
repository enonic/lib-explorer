import {
	isNotSet,
	toStr
} from '@enonic/js-utils';

import {create} from '/lib/explorer/document/create';
import {update} from '/lib/explorer/document/update';


const CATCH_CLASS_NAMES = [
	'com.enonic.xp.node.NodeIdExistsException',
	'com.enonic.xp.node.NodeAlreadyExistAtPathException'
];


export function createOrUpdate({
	// These exist in rest and are common to both create and update
	//_name
	//_id, // NOTE Required by update
	//document_metadata
	...rest
}, {
	boolPartial,
	boolRequireValid,
	collectionName,
	connection,
	documentTypeObj,
	language,
	...ignoredOptions
} = {}) {
	Object.keys(rest).forEach((k) => {
		if (k.startsWith('__')) {
			log.warning(`Deprecation: Function signature changed. Added second argument for options.
		Old: document.createOrUpdate({${k}, ...})
		New: document.createOrUpdate({...}, {${k.substring(2)}})`);
			if(k === '__boolPartial') {
				if (isNotSet(boolPartial)) {
					boolPartial = rest[k];
				}
			} else if(k === '__boolRequireValid') {
				if (isNotSet(boolRequireValid)) {
					boolRequireValid = rest[k];
				}
			} else if(k === '__connection') {
				if (isNotSet(connection)) {
					connection = rest[k];
				}
			} else {
				log.warning(`document.createOrUpdate: Ignored option:${k} value:${toStr(rest[k])}`);
			}
			delete rest[k];
		} // startsWith __
	});

	if (isNotSet(boolPartial)) {
		boolPartial = false;
	}

	if (isNotSet(boolRequireValid)) {
		boolRequireValid = true;
	}

	if (Object.keys(ignoredOptions).length) {
		log.warning(`document.createOrUpdate: Ignored options:${toStr(ignoredOptions)}`);
	}

	let rv;
	try {
		rv = create(rest, {
			boolRequireValid,
			collectionName,
			connection,
			documentTypeObj,
			language
		});
	} catch (catchedError) {
		if (catchedError.class && CATCH_CLASS_NAMES.includes(catchedError.class.name)) {
			rv = update(rest, {
				boolPartial,
				boolRequireValid,
				collectionName,
				connection,
				documentTypeObj,
				language
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
