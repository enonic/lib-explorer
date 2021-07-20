import {
	isSet//,
	//toStr
} from '@enonic/js-utils';

import {NT_FIELD_VALUE} from '/lib/explorer/model/2/constants';
import {Node} from '/lib/explorer/nodeTypes/Node';
import {getReference} from '/lib/explorer/node/getReference';


export class FieldValue extends Node {
	constructor({
		__connection,
		_parentPath
	}, {
		connection = __connection
	} = {}) {
		if (isSet(__connection)) {
			log.warning(`Deprecation: Function signature changed. Added second argument for options.
				Old: new FieldValue({__connection, ...})
				New: new FieldValue({...}, {connection})`);
		}
		super({
			_parentPath,
			fieldReference: getReference({
				connection,
				path: _parentPath
			}),
			type: NT_FIELD_VALUE
		});
	}
}
