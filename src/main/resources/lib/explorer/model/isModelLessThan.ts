import type {
	GetContext,
	PrincipalKey,
	RepoConnection
} from '../types.d';


import {getModel} from '/lib/explorer/model/getModel';
import {connect} from '/lib/explorer/repo/connect';


export function isModelLessThan({
	version,
	// Optional
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
	version :number
	// Optional
	branch? :string
	context? :GetContext
	principals? :Array<PrincipalKey>
	repoId? :string
	connection? :RepoConnection
}) {
	const currentModel = getModel({connection});
	const boolLessThan = currentModel < version;
	if (boolLessThan) {
		log.info(`currentModel:${currentModel} < version:${version}`);
	} /*else {
		log.debug(`currentModel:${currentModel} >= version:${version}`);
	}*/
	return boolLessThan;
}
