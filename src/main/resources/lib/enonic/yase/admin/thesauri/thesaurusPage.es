import {NT_SYNONYM, TOOL_PATH} from '/lib/enonic/yase/constants';
import {htmlResponse} from '/lib/enonic/yase/admin/htmlResponse';
import {insertAdjacentHTML} from '/lib/enonic/yase/insertAdjacentHTML';
import {connectRepo} from '/lib/enonic/yase/connectRepo';

//import {toStr} from '/lib/enonic/util';
import {forceArray} from '/lib/enonic/util/data';


function getThesaurus({name}) {
	const connection = connectRepo();
	const queryParams = {
		count: -1,
		filters: {
			boolean: {
				must: [{
					hasValue: {
						field: 'type',
						values: [NT_SYNONYM]
					}
				}]
			}
		},
		query: `_parentPath = '/thesauri/${name}'`,
		sort: '_name ASC'
	};
	const queryRes = connection.query(queryParams);
	const thesaurus = queryRes.hits.map((hit) => {
		const {
			_name, displayName, from, to
		} = connection.get(hit.id);
		return {
			displayName, from, id: hit.id, name: _name, to
		};
	});
	return thesaurus;
}


export function thesaurusPage({
	path
}, {
	messages,
	status
} = {}) {
	const fileName = path.replace(`${TOOL_PATH}/thesauri/`, '');
	//log.info(toStr({fileName}));
	const [match, name, dotExtension] = fileName.match(/^(.*?)(\.csv)?$/); // eslint-disable-line no-unused-vars
	//log.info(toStr({match, name, dotExtension}));
	const thesaurus = getThesaurus({name});
	if (dotExtension === '.csv') {
		return {
			body: `"From","To"${thesaurus.map(s => `\n"${Array.isArray(s.from) ? s.from.join(', ') : s.from}","${Array.isArray(s.to) ? s.to.join(', ') : s.to}"`).join('')}\n`,
			contentType: 'text/csv;charset=utf-8',
			headers: {
				'Content-Disposition': `attachment; filename="${name}.csv"`
			}
		};
	}
	const fromInput = '<input class="block" name="from" type="text"/>';
	const toInput = '<input class="block" name="to" type="text"/>';
	return htmlResponse({
		main: `<h1>${name}</h1>
<form action="${path}" autocomplete="off" method="POST">
	<fieldset>
		<legend>Synonym</legend>
		<label>
			<span>From</span>
			${fromInput}
			<button type="button" onClick="${insertAdjacentHTML(fromInput)}">+</button>
		</label>
		<label>
			<span>To</span>
			${toInput}
			<button type="button" onClick="${insertAdjacentHTML(toInput)}">+</button>
		</label>
		<button type="submit">Save synonym</button>
	</fieldset>
</form>
<table>
	<thead>
		<tr>
			<th>Display name</th>
			<th>From</th>
			<th>To</th>
		</tr>
	</thead>
	<tbody>
		${thesaurus.map(s => `<tr>
	<td>${s.displayName}</td>
	<td>${forceArray(s.from).join('<br/>')}</td>
	<td>${forceArray(s.to).join('<br/>')}</td>
	<td><a href="${TOOL_PATH}/thesauri/${name}/${s.id}">Edit</a></td>
</tr>`).join('\n')}
	</tbody>
</table>`,
		messages,
		path,
		status,
		title: `${name} - Thesaurus`
	});
}
