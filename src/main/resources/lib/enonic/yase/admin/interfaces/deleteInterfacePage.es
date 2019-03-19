import {TOOL_PATH} from '/lib/enonic/yase/constants';
import {htmlResponse} from '/lib/enonic/yase/admin/htmlResponse';


export const deleteInterfacePage = ({
	path: reqPath
}) => {
	const relPath = reqPath.replace(TOOL_PATH, '');
	const pathParts = relPath.match(/[^/]+/g);
	const interfaceName = pathParts[1];
	return htmlResponse({
		main: `<form action="${TOOL_PATH}/interfaces/${interfaceName}/delete" method="post">
	<fieldset>
		<legend>Confirm delete interface</legend>
		<label>
			<span>Type in interface name to confirm</span>
			<input name="typedInterfaceName" value=""/>
		</label>
		<button type="submit">Confirm delete</button>
	<fieldset>
</form>`
	});
} // deleteInterfacePage
