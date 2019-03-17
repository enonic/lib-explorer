//import {toStr} from '/lib/enonic/util';
import {dlv} from '/lib/enonic/util/object';
import {
	BRANCH_ID,
	TOOL_PATH,
	REPO_ID
} from '/lib/enonic/yase/constants';
import {connectRepo} from '/lib/enonic/yase/connectRepo';
import {htmlResponse} from '/lib/enonic/yase/admin/htmlResponse';
import {fieldFormHtml} from '/lib/enonic/yase/admin/fields/fieldFormHtml';


export function createOrEditFieldPage({
	path: reqPath/*,
	params: {
		id,
		name
	}*/
}) {
	//log.info(toStr({reqPath}));
	const relPath = reqPath.replace(TOOL_PATH, ''); //log.info(toStr({relPath}));
	const pathParts = relPath.match(/[^/]+/g); //log.info(toStr({pathParts}));
	const fieldName = pathParts[1]; //log.info(toStr({fieldName}));
	const connection = connectRepo({
		repoId: REPO_ID,
		branch: BRANCH_ID
	});
	const path = `/fields/${fieldName}`;
	//log.info(toStr({path}));

	const node = connection.get(path);
	//log.info(toStr({node}));

	const {description, displayName, indexConfig, key} = node;
	//log.info(toStr({description, displayName, key, indexConfig}));

	return htmlResponse({
		main: fieldFormHtml({
			description,
			decideByType: dlv(indexConfig, 'decideByType', true),
			displayName,
			enabled: dlv(indexConfig, 'enabled', true),
			fulltext: dlv(indexConfig, 'fulltext', true),
			includeInAllText: dlv(indexConfig, 'includeInAllText', true),
			key,
			ngram: dlv(indexConfig, 'ngram', true),
			path: dlv(indexConfig, 'path', false)
			/*,
			instruction*/
		}),
		path: reqPath,
		title: `Edit field ${displayName} `
	});
}
