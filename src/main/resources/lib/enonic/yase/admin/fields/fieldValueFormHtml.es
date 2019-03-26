import {TOOL_PATH} from '/lib/enonic/yase/constants';


export function fieldValueFormHtml({
	field = '',
	action=`${TOOL_PATH}/fields/${field}/values`, // Means create
	displayName = '',
	value = ''
} = {}) {
	return `<form action="${action}" autocomplete="off" class="ui form" method="POST">
	<h2>${value ? 'Edit' : 'New'} value</h2>

	<label>
		<span>Value</span>
		${value ? `<span>${value}</span><input name="value" type="hidden" value="${value}"/>` : `<input name="value" type="text" value="${value}"/>
		<p class="help-text">Used to mark scraped documents and during aggregation.</p>`}
	</label>

	<label>
		<span>Display name</span>
		<input name="displayName" type="text" value="${displayName}"/>
		<p class="help-text">Used when selecting field values. Could also be used in front-end facets.</p>
	</label>

	<button class="ui button" type="submit"><i class="green plus ui icon"></i>${value ? 'Modify' : 'Create'} field value ${displayName}</button>
</form>`;
}
