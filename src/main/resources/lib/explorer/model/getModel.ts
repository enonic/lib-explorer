import type {
	PrincipalKeyRole,
	RepoConnection
} from '/lib/explorer-typescript/types.d';


//import {toStr} from '@enonic/js-utils';

import {connect} from '/lib/explorer/repo/connect';


export function getModel({
	branch,
	context,
	principals,
	repoId,
	connection = connect({
		branch,
		context,
		principals,
		repoId
	})
} :{
	branch? :string
	context? :string
	principals? :Array<PrincipalKeyRole>
	repoId? :string
	connection :RepoConnection
}) {
	const rootNode = connection.get('/') as {
		model :number
	};
	//log.debug(`rootNode:${toStr(rootNode)}`);
	const {model = -1} = rootNode;
	//log.debug(`model:${toStr(model)}`);
	return model;
}