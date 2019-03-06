//import {toStr} from '/lib/enonic/util';

import {TOOL_PATH} from '/lib/enonic/yase/constants';
import {queryCollections} from '/lib/enonic/yase/admin/collections/queryCollections';
import {htmlResponse} from '/lib/enonic/yase/admin/htmlResponse';


export const collectionsPage = ({
	path
}, {
	messages,
	status
} = {}) => {
	const collections = queryCollections();
	//log.info(toStr({collections}));
	return htmlResponse({
		main: `<table>
	<thead>
		<tr>
			<th>Name</th>
			<th>Collector</th>
			<th>Action(s)</th>
		</tr>
	</thead>
	<tbody>
		${collections.hits.map(({_name, displayName, collector: {name: collectorName}}) => `<tr>
			<td>${displayName}</td>
			<td>${collectorName}</td>
			<td>
				<form action="${TOOL_PATH}/collections/${_name}" method="post">
					<button type="submit">Edit</button>
				</form>
				<form action="${TOOL_PATH}/collections/${_name}/collect" method="post">
					<button type="submit">Collect</button>
				</form>
			</td>
		</tr>`).join('\n')}
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
