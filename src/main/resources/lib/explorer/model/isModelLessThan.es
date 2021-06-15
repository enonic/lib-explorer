import {getModel} from '/lib/explorer/model/getModel';
import {connect} from '/lib/explorer/repo/connect';

export function isModelLessThan({
	branch,
	context,
	principals,
	repoId,
	connection = connect({
		branch,
		context,
		principals,
		repoId
	}),
	version
}) {
	const currentModel = getModel({connection});
	const boolLessThan = currentModel < version;
	if (boolLessThan) {
		log.info(`currentModel:${currentModel} < version:${version}`);
	} else {
		log.debug(`currentModel:${currentModel} >= version:${version}`);
	}
	return boolLessThan;
}
