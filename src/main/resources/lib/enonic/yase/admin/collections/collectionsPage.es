//import {toStr} from '/lib/enonic/util';

import {TOOL_PATH} from '/lib/enonic/yase/constants';
import {getCollections} from '/lib/enonic/yase/admin/collections/getCollections';
import {htmlResponse} from '/lib/enonic/yase/admin/htmlResponse';


export const collectionsPage = ({
	path
}, {
	messages,
	status
} = {}) => {
	const collections = getCollections();
	//log.info(toStr({collections}));
	return htmlResponse({
		main: `<table>
	<thead>
		<tr>
			<th>Name</th>
			<th>Collector</th>
		</tr>
	</thead>
	<tbody>
		${collections.hits.map(({_name, displayName, collector: {name: collectorName}}) => `<tr><td><a href="${TOOL_PATH}/collections/${_name}">${displayName}</a></td><td>${collectorName}</td></tr>`).join('\n')}
	</tbody>
</table>
<ul>
	<li><a href="${TOOL_PATH}/collections/createform">Create collection</a></li>
</ul>`,
		messages,
		path,
		status,
		title: 'Collections'
	});
};
