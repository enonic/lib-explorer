//import {toStr} from '/lib/enonic/util';

import {TOOL_PATH} from '/lib/enonic/yase/constants';
import {getDocumentCount} from '/lib/enonic/yase/admin/collections/getDocumentCount';
import {queryCollections} from '/lib/enonic/yase/admin/collections/queryCollections';
import {usedInInterfaces} from '/lib/enonic/yase/admin/collections/usedInInterfaces';
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
			<th>Documents</th>
			<th>Interfaces</th>
			<th>Collector</th>
			<th>Action(s)</th>
		</tr>
	</thead>
	<tbody>
		${collections.hits.map(({_name: name, displayName, collector: {name: collectorName}}) => `<tr>
			<td>${displayName}</td>
			<td style="text-align: right;">${getDocumentCount(name)}</td>
			<td>${usedInInterfaces(name).join(', ')}</td>
			<td>${collectorName}</td>
			<td>
				<form action="${TOOL_PATH}/collections/${name}" method="get">
					<button type="submit">Edit</button>
				</form>
				<form action="${TOOL_PATH}/collections/${name}/delete" method="get">
					<button type="submit">Delete</button>
				</form>
				<form action="${TOOL_PATH}/collections/${name}/collect" method="post">
					<button type="submit">Collect</button>
				</form>
				<form action="${TOOL_PATH}/collections/${name}/collect?resume=true" method="post">
					<button type="submit">Resume</button>
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
