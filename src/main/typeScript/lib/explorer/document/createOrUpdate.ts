import type {
	LooseObject
} from '../types';
import type {
	JavaBridge,
	UpdateParameterObject
} from './types';

import {
	isNotSet as notSet,
	isSet,
	isString,
	isUuidV4String//,
	//toStr
} from '@enonic/js-utils';

import {
	BRANCH_ID_EXPLORER,
	COLLECTION_REPO_PREFIX,
	PRINCIPAL_EXPLORER_READ,
	REPO_ID_EXPLORER
} from '../constants';
import {create} from './create';
import {update} from './update';


export function createOrUpdate(
	createOrUpdateParameterObject :UpdateParameterObject,
	javaBridge :JavaBridge
) {
	const {log} = javaBridge;
	//log.info('createOrUpdateParameterObject:%s', createOrUpdateParameterObject);

	const {
		data:{
			_id
		} = {}
	} = createOrUpdateParameterObject;
	if (!_id) {
		return create(createOrUpdateParameterObject, javaBridge);
	}

	let {
		collectionId,
		collectionName
	} = createOrUpdateParameterObject;

	//──────────────────────────────────────────────────────────────────────────
	// Checking required parameters
	//──────────────────────────────────────────────────────────────────────────
	if (
		notSet(collectionName) &&
		notSet(collectionId)
	) {
		throw new Error("createOrUpdate: either provide collectionName or collectionId!");
	}

	//──────────────────────────────────────────────────────────────────────────
	// Checking type of provided parameters
	//──────────────────────────────────────────────────────────────────────────
	if (
		isSet(collectionId) &&
		!isUuidV4String(collectionId)
	) {
		throw new TypeError("createOrUpdate: parameter 'collectionId' is not an uuidv4 string!");
	}

	if (
		isSet(collectionName) &&
		!isString(collectionName)
	) {
		throw new TypeError("createOrUpdate: parameter 'collectionName' is not a string!");
	}
	//──────────────────────────────────────────────────────────────────────────

	if (notSet(collectionName)) {
		const explorerReadConnection = javaBridge.connect({
			branch: BRANCH_ID_EXPLORER,
			principals: [PRINCIPAL_EXPLORER_READ],
			repoId: REPO_ID_EXPLORER
		});
		const collectionNode :LooseObject = explorerReadConnection.get(collectionId) as LooseObject;
		collectionName = collectionNode['_name'] as string;
	}

	const repoId = `${COLLECTION_REPO_PREFIX}${collectionName}`;
	const collectionRepoReadConnection = javaBridge.connect({
		branch: 'master',
		principals: [PRINCIPAL_EXPLORER_READ],
		repoId
	});
	if (collectionRepoReadConnection.exists(_id).includes(_id)) {
		return update(createOrUpdateParameterObject, javaBridge);
	}
	return create(createOrUpdateParameterObject, javaBridge);
}
