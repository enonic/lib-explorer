import {assetUrl, serviceUrl} from '/lib/xp/portal';

import {
	PRINCIPAL_YASE_READ,
	TOOL_PATH
} from '/lib/enonic/yase/constants';
import {htmlResponse} from '/lib/enonic/yase/admin/htmlResponse';
import {query} from '/lib/enonic/yase/interface/query';
import {connect} from '/lib/enonic/yase/repo/connect';


const ID_REACT_INTERFACES_CONTAINER = 'reactInterfacesContainer';


export function list({
	params: {
		messages,
		status
	},
	path
}) {
	const connection = connect({principals: [PRINCIPAL_YASE_READ]});
	const interfaces = query({connection});
	interfaces.hits = interfaces.hits.map(({_name: name, displayName}) => ({displayName, name}));

	const propsObj = {
		interfaces,
		servicesBaseUrl: serviceUrl({
			service: 'whatever'
		}).replace('/whatever', ''),
		TOOL_PATH
	};
	const propsJson = JSON.stringify(propsObj);

	return htmlResponse({
		bodyEnd: [
			`<script type='module' defer>
		import {Interfaces} from '${assetUrl({path: 'react/Interfaces.esm.js'})}'
		ReactDOM.render(
			React.createElement(Interfaces, JSON.parse('${propsJson}')),
			document.getElementById('${ID_REACT_INTERFACES_CONTAINER}')
		);
</script>`
		],
		main: `<table class="collapsing compact ui sortable selectable celled striped table">
	<thead>
		<tr>
			<th class="sorted ascending">Name</th>
			<th class="no-sort">Action(s)</th>
		</tr>
	</thead>
	<tbody>
		${interfaces.hits.map(({_name: name, displayName}) => `<tr>
			<td>${displayName}</td>
			<td>
				<a class="tiny compact ui button" href="${TOOL_PATH}/interfaces/edit/${name}"><i class="blue edit icon"></i>Edit</a>
				<a class="tiny compact ui button" href="${TOOL_PATH}/interfaces/delete/${name}"><i class="red trash alternate outline icon"></i>Delete</a>
			</td>
		</tr>`).join('\n')}
	</tbody>
</table><a class="compact ui button" href="${TOOL_PATH}/interfaces/new"><i class="green plus icon"></i>New interface</a>
<div id="${ID_REACT_INTERFACES_CONTAINER}"/>`,
		messages,
		path,
		status,
		title: 'Interfaces'
	});
} // function list
