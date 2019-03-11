import {toStr} from '/lib/enonic/util';
import {
	BRANCH_ID,
	TOOL_PATH,
	REPO_ID
} from '/lib/enonic/yase/constants';
import {htmlResponse} from '/lib/enonic/yase/admin/htmlResponse';
import {fieldFormHtml} from '/lib/enonic/yase/admin/fields/fieldFormHtml';


export function createOrEditFieldPage({
	path: reqPath
}) {
	log.info(toStr({reqPath}));
	const relPath = reqPath.replace(TOOL_PATH, ''); log.info(toStr({relPath}));
	const pathParts = relPath.match(/[^/]+/g); log.info(toStr({pathParts}));
	const fieldName = pathParts[1]; log.info(toStr({fieldName}));
	const connection = connectRepo({
		repoId: REPO_ID,
		branch: BRANCH_ID
	});
	const key = `/fields/${fieldName}`;
	const node = connection.get(key);
	log.info(toStr({node}));

	const {description, displayName, indexConfig} = node;
	log.info(toStr({description, displayName, key, indexConfig}));

	const decideByType = dlv(indexConfig, 'decideByType', true);
	const enabled = dlv(indexConfig, 'enabled', true);
	const fulltext = dlv(indexConfig, 'fulltext', true);
	const includeInAllText = dlv(indexConfig, 'includeInAllText', true);
	const ngram = dlv(indexConfig, 'ngram', true);
	const path = dlv(indexConfig, 'path', false);

	return htmlResponse({
		main: fieldFormHtml({
			description,
			decideByType,
			displayName,
			enabled,
			fulltext,
			includeInAllText,
			key,
			ngram,
			path/*,
			instruction*/
		}),
		path: reqPath,
		title: `Edit field ${key} `
	});
}
