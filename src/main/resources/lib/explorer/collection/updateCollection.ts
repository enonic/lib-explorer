import type {
	CollectionNode,
	CollectionWithCron
} from '/lib/explorer/types/Collection.d';

//import {toStr} from '@enonic/js-utils';

import {coerseCollectionType} from '/lib/explorer/collection/coerseCollectionType';
import {createDocumentType} from '/lib/explorer/documentType/createDocumentType';
import {
	//NT_COLLECTION,
	PRINCIPAL_EXPLORER_WRITE
} from '/lib/explorer/constants';
import {exists} from '/lib/explorer/node/exists';
import {connect} from '/lib/explorer/repo/connect';
import {createOrModifyJobsFromCollectionNode} from '/lib/explorer/scheduler/createOrModifyJobsFromCollectionNode';

//@ts-ignore
import {getUser} from '/lib/xp/auth';

//@ts-ignore
import {reference} from '/lib/xp/value';



export function updateCollection({
	_id, // nonNull
	_name, // nonNull
	//_path, // nonNull
	collector, // optional
	cron, // This is no longer stored on the CollectionNode, but is passed in here from GraphQL mutation.
	doCollect,
	documentTypeId, // optional
	language // optional
} :CollectionWithCron ) {
	//log.debug(`_id:${toStr(_id)}`);
	//log.debug(`_name:${toStr(_name)}`);
	//log.debug(`collector:${toStr(collector)}`);
	//log.debug(`doCollect:${toStr(doCollect)}`);
	//log.debug(`documentTypeId:${toStr(documentTypeId)}`);

	const writeConnection = connect({
		principals: [PRINCIPAL_EXPLORER_WRITE]
	});

	const oldNode = writeConnection.get(_id);
	//log.debug(`oldNode:${toStr(oldNode)}`);

	if (_name !== oldNode._name) {
		const moveParams = {
			source: _id,
			target: _name
		};
		//log.debug(`moveParams:${toStr({moveParams})}`);
		const boolMoved = writeConnection.move(moveParams);
		if (!boolMoved) {
			throw new Error(`Unable to move/rename _id:${_id} from _path:${oldNode._path} to _name:${_name}!`);
		}
		writeConnection.refresh(); // So the data becomes immidiately searchable
	}

	const propertiesToBeUpdated :Partial<CollectionNode> = {
		//_indexConfig: {default: 'byType'},
		//_inheritsPermissions: true, // false is the default and the fastest, since it doesn't have to read parent to apply permissions.
		//_name,
		//_nodeType: NT_COLLECTION,
		//_parentPath: '/collections',
		//_permissions: [],
		//creator = getUser().key
		//createdTime: new Date()
		modifiedTime: new Date(),
		modifier: getUser().key,
		language
	};
	//log.debug(`propertiesToBeUpdated:${toStr(propertiesToBeUpdated)}`);

	if (collector) {
		const {
			name: collectorName,
			configJson
		} = collector;
		if (collectorName || configJson) {
			//@ts-ignore
			propertiesToBeUpdated.collector = {};
		}
		if (collectorName) {
			propertiesToBeUpdated.collector.name = collectorName;
		}
		if (configJson) {
			propertiesToBeUpdated.collector.configJson = configJson;
			propertiesToBeUpdated.collector.config = JSON.parse(configJson);
		}
	}
	//log.debug(`propertiesToBeUpdated:${toStr(propertiesToBeUpdated)}`);

	if (!documentTypeId) {
		// Create DocumentType With CollectionName pluss some integer if already existing
		let documentTypeName = _name;
		let i = 0;
		while (exists({
			connection: writeConnection,
			_parentPath: '/documentTypes',
			_name: documentTypeName
		})) {
			i++;
			documentTypeName = `${_name}_${i}`; // /^[a-z][a-zA-Z0-9_]*$/
		}
		const createdDocumentTypeNode = createDocumentType({_name: documentTypeName});
		//log.debug(`createdDocumentTypeNode:${toStr(createdDocumentTypeNode)}`);
		documentTypeId = createdDocumentTypeNode._id;
	}
	propertiesToBeUpdated.documentTypeId = reference(documentTypeId);
	//log.debug(`updateCollection documentTypeId:${toStr(documentTypeId)}`); // toStr on reference becomes ''
	//log.debug(`propertiesToBeUpdated:${toStr(propertiesToBeUpdated)}`);

	const modifiedNode = writeConnection.modify({
		key: _id,
		editor: (n :CollectionNode) => {
			Object.keys(propertiesToBeUpdated).forEach((property) => {
				const value = propertiesToBeUpdated[property];
				n[property] = value;
			});
			return n;
		}
	});
	//log.debug(`modifiedNode:${toStr(modifiedNode)}`);

	if (modifiedNode) {
		writeConnection.refresh(); // So the data becomes immidiately searchable
		const modifiedNodeWithCron = JSON.parse(JSON.stringify(modifiedNode)) as CollectionWithCron;
		modifiedNodeWithCron.cron = cron;
		modifiedNodeWithCron.doCollect = doCollect;
		//log.debug(`modifiedNode:${toStr(modifiedNode)}`);
		createOrModifyJobsFromCollectionNode({
			connection: writeConnection,
			collectionNode: modifiedNodeWithCron,
			timeZone: 'GMT+02:00' // CEST (Summer Time)
			//timeZone: 'GMT+01:00' // CET
		});
	} else {
		throw new Error(`Something went wrong when trying to modify collection ${_name}`);
	}

	return coerseCollectionType(modifiedNode);
}
