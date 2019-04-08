import {forceArray} from '/lib/enonic/util/data';

import {TOOL_PATH} from '/lib/enonic/yase/constants';
import {insertAdjacentHTML} from '/lib/enonic/yase/insertAdjacentHTML';


export function form({
	from = [''],
	to = [''],
	thesaurusName,
	synonymName,
	displayName = '',
	action = synonymName
		? `${TOOL_PATH}/thesauri/synonyms/${thesaurusName}/update/${synonymName}`
		: `${TOOL_PATH}/thesauri/synonyms/${thesaurusName}/create`
}) {
	const fromInput = '<input class="block" name="from" type="text"/>';
	const toInput = '<input class="block" name="to" type="text"/>';
	return `<form
		action="${action}"
		autocomplete="off"
		class="ui form"
		method="POST"
		style="width: 100%;"
	>
		<div class="ui header">${synonymName ? 'Edit' : 'New'} synonym ${displayName}</div>
		<div class="grouped fields">
			<!--div class="field">
				<label>Display name</label>
				<input name="displayName" type="text" value="${displayName}"/>
			</div-->
			<div class="field">
				<label>From</label>
				${forceArray(from).map(value => `<input class="block" name="from" type="text" value="${value}"/>`).join('\n')}
				<button class="ui icon button" type="button" onClick="${insertAdjacentHTML(fromInput)}"><i class="green plus icon"></i></button>
			</div>
			<div class="field">
				<label>To</label>
				${forceArray(to).map(value => `<input class="block" name="to" type="text" value="${value}"/>`).join('\n')}
				<button class="ui icon button" type="button" onClick="${insertAdjacentHTML(toInput)}"><i class="green plus icon"></i></button>
			</div>
			<div class="field">
				<button class="ui primary button" type="submit"><i class="save icon"></i>${synonymName ? 'Update' : 'Create'} synonym</button>
			</div>
		</div>
	</form>`;
} // form
