import {TOOL_PATH} from '/lib/enonic/yase/constants';
import {htmlResponse} from '/lib/enonic/yase/admin/htmlResponse';


export const deleteCollectionPage = ({
	path: reqPath
}) => {
	const relPath = reqPath.replace(TOOL_PATH, '');
	const pathParts = relPath.match(/[^/]+/g);
	const collectionName = pathParts[1];
	return htmlResponse({
		main: `<form action="${TOOL_PATH}/collections/${collectionName}/delete" method="post">
	<fieldset>
		<legend>Confirm delete collection</legend>
		<label>
			<span>Type in collection name to confirm</span>
			<input name="typedCollectionName" value=""/>
		</label>
		<button type="submit">Confirm delete</button>
	<fieldset>
</form>`
	});
} // deleteCollectionPage
