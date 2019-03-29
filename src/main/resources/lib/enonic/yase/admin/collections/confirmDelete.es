//import {toStr} from '/lib/enonic/util';
import {TOOL_PATH} from '/lib/enonic/yase/constants';
import {htmlResponse} from '/lib/enonic/yase/admin/htmlResponse';
import {menu} from '/lib/enonic/yase/admin/collections/menu';


export const confirmDelete = ({
	path
}) => {
	const relPath = path.replace(TOOL_PATH, ''); //log.info(toStr({relPath}));
	const pathParts = relPath.match(/[^/]+/g); //log.info(toStr({pathParts}));
	const name = pathParts[2];
	return htmlResponse({
		bodyBegin: [
			menu({path})
		],
		main: `<form action="${TOOL_PATH}/collections/delete/${name}" method="post">
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
} // confirmDelete
