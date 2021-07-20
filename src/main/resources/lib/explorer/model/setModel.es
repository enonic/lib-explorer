import {toStr} from '@enonic/js-utils';


export function setModel({
	connection,
	version
}) {
	connection.modify({
		key: '/',
		editor: (rootNode) => {
			//log.debug(`rootNode:${toStr(rootNode)}`);
			if (!rootNode._indexConfig) { rootNode._indexConfig = {}; }
			if (!rootNode._indexConfig.configs) { rootNode._indexConfig.configs = []; }
			rootNode._indexConfig.configs.push({
				path: 'model',
				config: 'minimal'
			});
			rootNode.model = version;
			//log.debug(`modified rootNode:${toStr(rootNode)}`);
			return rootNode;
		}
	});
	log.debug(`sat model to:${toStr(version)}`);
	connection.refresh();
}
