import {TOOL_PATH} from '/lib/enonic/yase/constants';


export function fieldFormHtml({
	action = `${TOOL_PATH}/fields`,
	description = '',
	decideByType = true,
	displayName = '',
	enabled = true,
	fulltext = true,
	includeInAllText = true,
	instruction = 'type',
	key = '',
	ngram = true,
	path = false,
	fieldType = 'text'
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
<form action="${action}" autocomplete="off" class="ui form" method="POST">
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
			<span>Type</span>
			<select class="ui dropdown" name="fieldType" value="${fieldType}">
				<option value="text" selected>Text</option>
				<option value="tag">Tag</option><!-- Enum Map Keys -->
				<option value="uri">Uri</option>
				<option value="html">Html</option>
				<option value="base64">Base64 encoded data</option>
			</select>
		</label>

		<label>
			<span>Index config</span>
			<select class="ui dropdown" id="instruction-selector" name="instruction" onchange="setCustomInstructionsVisibility(this)" value="${instruction}">
				<option value="type" selected>type (default) - Indexing is done based on type; e.g numeric values are indexed as both string and numeric.</option>
				<option value="minimal">minimal - Value is indexed as a string-value only, no matter what type of data.</option>
				<option value="none">none - Value is not indexed.</option>
				<option value="fulltext">fulltext - Values are stored as ‘ngram’, ‘analyzed’ and also added to the _allText-field</option>
				<option value="path">path - Values are stored as ‘path’ type and applicable for the pathMatch-function</option>
				<option value="custom">custom - use settings below</option>
			</select>
		</label>

		<div class="grouped fields" id="custom-instructions" style="display:none">
			<label>Custom index config</label>
			<div class="field">
				<div class="ui checkbox">
					<input name="decideByType" type="checkbox" ${decideByType ? 'checked' : ''}/>
					<label>decideByType</label>
				</div>
			</div>

			<div class="field">
				<div class="ui checkbox">
					<input name="enabled" type="checkbox" ${enabled ? 'checked' : ''}/>
					<label>enabled</label>
				</div>
			</div>

			<div class="field">
				<div class="ui checkbox">
					<input name="nGram" type="checkbox" ${ngram ? 'checked' : ''}/>
					<label>nGram</label>
				</div>
			</div>

			<div class="field">
				<div class="ui checkbox">
					<input name="fulltext" type="checkbox" ${fulltext ? 'checked' : ''}/>
					<label>fulltext</label>
				</div>
			</div>

			<div class="field">
				<div class="ui checkbox">
					<input name="includeInAllText" type="checkbox" ${includeInAllText ? 'checked' : ''}/>
					<label>includeInAllText</label>
				</div>
			</div>

			<div class="field">
				<div class="ui checkbox">
					<input name="path" type="checkbox" ${path ? 'checked' : ''}/>
					<label>path</label>
				</div>
			</div>
		</div>

		<button class="ui button" type="submit"><i class="green plus icon"></i>${key ? 'Modify' : 'Create'} field</button>
	</fieldset>
</form><script type="text/javascript">
ready(function() {
	setCustomInstructionsVisibility(document.getElementById('instruction-selector'));
})
</script>`;
}
