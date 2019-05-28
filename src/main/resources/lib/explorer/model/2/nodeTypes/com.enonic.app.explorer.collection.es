import {
	NT_COLLECTION
} from '/lib/explorer/model/2/constants';
import {node} from '/lib/explorer/model/2/nodeTypes/node';


export function collection({
	_id, // avoid from ...rest
	_path, // avoid from ...rest
	_permissions, // avoid from ...rest
	_parentPath = '/collections',
	collector,
	...rest
}) {
	if (
		collector.name === 'surgeon'
		|| collector.name === 'com.enonic.app.yase.collector.surgeon'
	) {
		collector.name = 'com.enonic.app.explorer.collector.surgeon';
	}
	if (
		collector.name === 'uptodate'
		|| collector.name === 'com.enonic.app.yase.collector.uptodate'
	) {
		collector.name = 'com.enonic.app.explorer.collector.uptodate';
	}
	return node({
		...rest,
		_parentPath,
		_indexConfig: {default: 'byType'},
		collector,
		type: NT_COLLECTION
	});
} // field
