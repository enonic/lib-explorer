import {TOOL_PATH} from '/lib/enonic/yase/constants';


export function fieldFormHtml({
	description = '',
	decideByType = true, //'checked',
	displayName = '',
	enabled = true, //'checked',
	fulltext = true, //'checked',
	includeInAllText = true, //'checked',
	instruction = 'type',
	key = '',
	operation = key ? 'UPDATE' : 'CREATE',
	ngram = true, //'checked',
	path = false //''
} = {}) {
	return `<script type="text/javascript">
	function ready(fn) {
		if (document.attachEvent ? document.readyState === "complete" : document.readyState !== "loading"){
			fn();
		} else {
			document.addEventListener('DOMContentLoaded', fn);
		}
	}
	function setCustomInstructionsVisibility(instructionSelectorEl) {
		document.getElementById('custom-instructions').style.display = instructionSelectorEl.value === 'custom' ? 'block' : 'none';
	}
</script>
<form action="${TOOL_PATH}/fields" autocomplete="off" method="POST">
	<input name="operation" type="hidden" value="${operation}">
	<fieldset>
		<legend>${key ? 'Edit' : 'New'} field ${displayName}</legend>

		<label>
			<span>Display name</span>
			<input name="displayName" type="text" value="${displayName}"/>
		</label>

		<label>
			<span>Key</span>
			<input name="key" ${key ? 'readonly ' : ''}type="text" value="${key}"/>
		</label>

		<label>
			<span>Description</span>
			<input name="description" type="text" value="${description}"/>
		</label>

		<!--label>
			<span>Icon url</span>
			<input name="iconUrl" type="text"/>
		</label-->

		<label>
			<span>Index config</span>
			<select id="instruction-selector" name="instruction" onchange="setCustomInstructionsVisibility(this)" value="${instruction}">
				<option value="type" selected>type (default) - Indexing is done based on type; e.g numeric values are indexed as both string and numeric.</option>
				<option value="minimal">minimal - Value is indexed as a string-value only, no matter what type of data.</option>
				<option value="none">none - Value is not indexed.</option>
				<option value="fulltext">fulltext - Values are stored as ‘ngram’, ‘analyzed’ and also added to the _allText-field</option>
				<option value="path">path - Values are stored as ‘path’ type and applicable for the pathMatch-function</option>
				<option value="custom">custom - use settings below</option>
			</select>
		</label>

		<div id="custom-instructions" style="display:none">
			<label>
				<span>decideByType</span>
				<input name="decideByType" type="checkbox" ${decideByType ? 'checked' : ''}/>
			</label>

			<label>
				<span>enabled</span>
				<input name="enabled" type="checkbox" ${enabled ? 'checked' : ''}/>
			</label>

			<label>
				<span>nGram</span>
				<input name="nGram" type="checkbox" ${ngram ? 'checked' : ''}/>
			</label>

			<label>
				<span>fulltext</span>
				<input name="fulltext" type="checkbox" ${fulltext ? 'checked' : ''}/>
			</label>

			<label>
				<span>includeInAllText</span>
				<input name="includeInAllText" type="checkbox" ${includeInAllText ? 'checked' : ''}/>
			</label>

			<label>
				<span>path</span>
				<input name="path" type="checkbox" ${path ? 'checked' : ''}/>
			</label>
		</div>

		<button type="submit">${operation === 'CREATE' ? 'Create' : 'Modify'} field</button>
	</fieldset>
</form><script type="text/javascript">
ready(function() {
	setCustomInstructionsVisibility(document.getElementById('instruction-selector'));
})
</script>`;
}
