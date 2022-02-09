import type {
	ParentPath,
	Path
} from '/lib/explorer-typescript/types.d';
//import type {IndexConfig} from '/lib/explorer-typescript/types/IndexConfig.d';


import {forceArray} from '@enonic/js-utils';

import {
	NT_SYNONYM
} from '/lib/explorer/model/2/constants';
import {node} from '/lib/explorer/model/2/nodeTypes/node';
import {dirname} from '/lib/explorer/path/dirname';


export function synonym({
	/* eslint-disable no-unused-vars */
	_id, // avoid from ...rest
	_permissions, // avoid from ...rest
	_path, // avoid from ...rest, also used in default for _parentPath
	displayName, // avoid from ...rest
	/* eslint-enable no-unused-vars */
	_name,
	_parentPath = dirname(_path) as ParentPath,
	from,
	to,
	//displayName = `${Array.isArray(from) ? from.join(', ') : from} => ${Array.isArray(to) ? to.join(', ') : to}`,
	...rest
} :{
	_name :string
	from :string|Array<string>
	to :string|Array<string>

	_id? :string
	_parentPath? :ParentPath
	_path? :Path
	_permissions? :Array<string>
	//_nodeType? :string
	//_versionKey? :string
	displayName? :string
}) {
	return node({
		...rest,
		_indexConfig: {default: 'byType'},// as IndexConfig,
		_name,
		_nodeType: NT_SYNONYM,
		_parentPath,
		from: forceArray(from),
		to: forceArray(to)
	});
} // field
