import type {AnyObject} from '../../types/index.d';
import type {JavaBridge} from '../../_coupling/types.d';
import type {UpdateParameterObject} from './types';

import {
	isNotSet as notSet,
	isSet,
	isString,
	isUuidV4String,
	toStr
} from '@enonic/js-utils';

import {
	BRANCH_ID_EXPLORER,
	COLLECTION_REPO_PREFIX,
	PRINCIPAL_EXPLORER_READ,
	REPO_ID_EXPLORER
} from '../../constants';
import {create} from './create';
import {update} from './update';


export function createOrUpdate(
	createOrUpdateParameterObject :UpdateParameterObject,
	javaBridge :JavaBridge
) {
	const {log} = javaBridge;
	//log.info('createOrUpdateParameterObject:%s', createOrUpdateParameterObject);

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
		log.debug('document.createOrUpdate: connecting to repoId:%s branch:%s with principals:%s', REPO_ID_EXPLORER, BRANCH_ID_EXPLORER, toStr([PRINCIPAL_EXPLORER_READ]));
		const explorerReadConnection = javaBridge.connect({
			branch: BRANCH_ID_EXPLORER,
			principals: [PRINCIPAL_EXPLORER_READ],
			repoId: REPO_ID_EXPLORER
		});
		const collectionNode :AnyObject = explorerReadConnection.get(collectionId) as AnyObject;
		collectionName = collectionNode['_name'] as string;
	}

	//──────────────────────────────────────────────────────────────────────────

	if (createOrUpdateParameterObject.data && createOrUpdateParameterObject.data._id) {
		return update(createOrUpdateParameterObject, javaBridge);
	}

	const {
		data:{
			_name,
			_parentPath = '/',
			_path = _name ? `${_parentPath}${_name}` : undefined
		} = {}
	} = createOrUpdateParameterObject;

	// /lib/xp/node.connect().create() ignores _path (but not _parentPath and _name, which makes up _path)

	if (!_path) {
		return create(createOrUpdateParameterObject, javaBridge);
	}

	const repoId = `${COLLECTION_REPO_PREFIX}${collectionName}`;
	log.debug('document.createOrUpdate: connecting to repoId:%s branch:%s with principals:%s', repoId, 'master', toStr([PRINCIPAL_EXPLORER_READ]));
	const collectionRepoReadConnection = javaBridge.connect({
		branch: 'master',
		principals: [PRINCIPAL_EXPLORER_READ],
		repoId
	});

	// Even though the documentation says it should always return an array, it returns true or false when input is a single id or path.
	const existsRes = collectionRepoReadConnection.exists(_path);
	//log.debug('document.createOrUpdate: existsRes:%s', existsRes);

	if (existsRes /*&& existsRes.includes(_path)*/) { // TypeError: collectionRepoReadConnection.exists(_path).indexOf is not a function
		return update(createOrUpdateParameterObject, javaBridge);
	}

	return create(createOrUpdateParameterObject, javaBridge);
}
