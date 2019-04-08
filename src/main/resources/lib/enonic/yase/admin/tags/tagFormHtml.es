import {TOOL_PATH} from '/lib/enonic/yase/constants';
import {getFields} from '/lib/enonic/yase/admin/fields/getFields';


export function tagFormHtml({
	connection, // Connecting many places leeds to loss of control over principals, so pass a connection around.
	displayName = '',
	field = '',
	tag = '',
	operation = tag ? 'UPDATE' : 'CREATE'
} = {}) {
	const fieldsArr = getFields({connection}).hits;
	const fieldsObj = {};
	fieldsArr.forEach(({_name, displayName: f}) => {
		fieldsObj[_name] = f;
	});

	return `<form action="${TOOL_PATH}/tags" autocomplete="off" method="POST">
	<input name="operation" type="hidden" value="${operation}">
	<h2>${tag ? 'Edit' : 'New'} tag</h2>
	<label>
		<span>Field</span>
		${field ? `<span>${fieldsObj[field]}</span><input name="field" type="hidden" value="${field}">` : `<select name="field">
			${fieldsArr.map(({_name, displayName: f}) => `<option ${field === _name ? 'selected' : ''} value="${_name}">${f}</option>`)}
		</select>`}
	</label>

	<label>
		<span>Tag</span>
		${tag ? `<span>${tag}</span><input name="tag" type="hidden" value="${tag}"/>` : `<input name="tag" type="text" value="${tag}"/>
		<p class="help-text">Used to mark scraped documents and during aggregation. Keep in mind it's case sensitive.</p>`}
	</label>

	<label>
		<span>Display name</span>
		<input name="displayName" type="text" value="${displayName}"/>
		<p class="help-text">Used when selecting tags. Could also be used in front-end facets.</p>
	</label>

	<button type="submit">${tag ? 'Modify' : 'Create'} tag ${displayName}</button>
</form>`;
}
