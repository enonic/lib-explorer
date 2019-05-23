//import {toStr} from '/lib/util';
import {NT_FIELD_VALUE} from '/lib/explorer/constants';
import {Node} from '/lib/explorer/nodeTypes/Node';
import {getReference} from '/lib/explorer/node/getReference';


export class FieldValue extends Node {
	constructor(params) {
		//log.info(toStr({params}));
		const {__connection: connection, _parentPath, _name} = params;
		/*params._indexConfig = {
			analyzer: 'document_index_default',
			default: 'byType'/*,
			configs: [{
				path: 'fieldReference',
				config: 'byType' // There is no reference index config
			}]*
		};*/
		params.fieldReference = getReference({
			connection,
			path: _parentPath
		});
		params.type = NT_FIELD_VALUE;
		//log.info(toStr({params}));
		super(params)
	}
}
