import type {DocumentTypeNode} from '/lib/explorer/types/DocumentType.d';


import {
	addQueryFilter,
	enonify,
	forceArray,
	isSet,
	toStr
} from '@enonic/js-utils';
//import {detailedDiff} from 'deep-object-diff';
import deepEqual from 'fast-deep-equal';

import HumanDiff from 'human-object-diff';
//import * as HumanDiff from 'human-object-diff'; // This fails when doing app-explorer development build

//import {getCachedDocumentType} from '/lib/explorer/documentType/documentTypesCache';
import {
	EVENT_SEND_TYPE_CUSTOM_EXPLORER_DOCUMENTTYPE_UPDATED,
	NT_COLLECTION,
	PRINCIPAL_EXPLORER_WRITE
} from '/lib/explorer/constants';
import {hasValue} from '/lib/explorer/query/hasValue';
import {connect} from '/lib/explorer/repo/connect';

//@ts-ignore
import {send} from '/lib/xp/event';
//@ts-ignore
//import {reference} from '/lib/xp/value';

import {reindexCollections} from '../collection/reindexCollections';
import {coerseDocumentType} from './coerseDocumentType';


//const Diff = require('diff');

const { diff: diffDocumentTypeProperties } = new HumanDiff({
	objectName: 'documentTypeProperties'
});


export function updateDocumentType({
	_id: documentTypeId,
	_name: newDocumentTypeName,
	_versionKey,
	addFields = true,
	properties = []
}) {
	//log.debug(`fields:${toStr(fields)}`);
	const writeConnection = connect({ principals: [PRINCIPAL_EXPLORER_WRITE] });
	const oldNode = writeConnection.get(documentTypeId) as DocumentTypeNode;
	if (!oldNode) {
		throw new Error(`Could not find documentType with id:${documentTypeId}!`);
	}
	//log.debug(`documentTypeId:${documentTypeId} newDocumentTypeName:${newDocumentTypeName} _versionKey:${_versionKey} activeVersionKey:${oldNode._versionKey}`);
	if (_versionKey !== oldNode._versionKey) {
		const msg = `Denying update! DocumentType changed since _versionKey:${_versionKey} activeVersionKey:${oldNode._versionKey} documentTypeId:${documentTypeId}`;
		log.error(msg);
		throw new Error(msg);
	}
	const {
		_name: oldName
	} = oldNode;
	if (newDocumentTypeName !== oldName) {
		//log.debug(`Trying to move/rename _id:${_id} from oldName:${oldName} to name:${_name}...`);
		const boolMovedOrRenamed = writeConnection.move({

			// Path or id of the node to be moved or renamed
			source: documentTypeId,

			// New path or name for the node. If the target ends in slash '/',
			// it specifies the parent path where to be moved.
			// Otherwise it means the new desired path or name for the node.
			target: newDocumentTypeName

		}); // NOTE: Will throw if _path already occupied :)
		if (boolMovedOrRenamed) {
			log.debug(`Moved/renamed id:${documentTypeId} from oldName:${oldName} to name:${newDocumentTypeName}`);
			writeConnection.refresh();
		} else {
			throw new Error(`Something went wrong when trying to move/rename id:${documentTypeId} from oldName:${oldName} to name:${newDocumentTypeName}`);
		}
	}

	const oldNodePropertiesForDiff = {
		addFields: isSet(oldNode.addFields) ? oldNode.addFields : true,
		//fields: oldNode.fields,
		properties: oldNode.properties
	};

	const nodePropertiesToUpdate = {
		addFields,

		// No point in forceArray, since Enonic will "destroy" on store,
		// but we're using forceArray so sort don't throw...
		properties: forceArray(properties).sort((a, b) => (a.name > b.name) ? 1 : -1)
	};
	//log.debug(`nodePropertiesToUpdate:${toStr(nodePropertiesToUpdate)}`);

	const enonifiedNodePropertiesToUpdate = enonify(nodePropertiesToUpdate);
	//log.debug(`enonifiedNodePropertiesToUpdate:${toStr(enonifiedNodePropertiesToUpdate)}`);

	if (!deepEqual(oldNodePropertiesForDiff, enonifiedNodePropertiesToUpdate)) {
		//log.debug(`!deepEqual`);
		//log.debug(`oldNodePropertiesForDiff:${toStr(oldNodePropertiesForDiff)}`);
		//log.debug(`Changes detected diff:${toStr(detailedDiff(oldNodePropertiesForDiff, enonifiedProperties))}`); // Too narrow
		//log.debug(`Changes detected diff:${toStr(Diff.diffJson(oldNodePropertiesForDiff, enonifiedProperties))}`); // Too noisy

		// Pretty good. (can crash on complicated data, perhaps circular structures, which we shouldn't have anyway)
		log.debug(`Changes detected diff:${toStr(diffDocumentTypeProperties(oldNodePropertiesForDiff, enonifiedNodePropertiesToUpdate))}`);

		const updatedNode :DocumentTypeNode = writeConnection.modify({
			key: documentTypeId,
			editor: (documentTypeNode :DocumentTypeNode) => {
				Object.keys(nodePropertiesToUpdate).forEach((k) => {
					documentTypeNode[k] = nodePropertiesToUpdate[k];
				});
				return documentTypeNode;
			}
		});
		writeConnection.refresh();
		send({
			type: EVENT_SEND_TYPE_CUSTOM_EXPLORER_DOCUMENTTYPE_UPDATED,
			distributed: true,
			data: updatedNode
		});
		/*getCachedDocumentType({ WARNING Cache remove is not cluster "safe"
			_id: documentTypeId,
			refresh: true
		});*/

		const collectionsUsingDocumentTypeQueryParams = {
			count: -1,
			filters: addQueryFilter({
				clause: 'must',
				filter: hasValue('_nodeType', [NT_COLLECTION]),
				filters: addQueryFilter({
					clause: 'must',
					filter: hasValue('documentTypeId', [documentTypeId]),
					filters: {}
				})
			}),
			query: ''
		};
		//log.debug(`collectionsUsingDocumentTypeQueryParams:${toStr(collectionsUsingDocumentTypeQueryParams)}`);

		const collectionIds = writeConnection.query(collectionsUsingDocumentTypeQueryParams).hits.map(({id})=>id);
		//log.debug(`collectionIds:${toStr(collectionIds)}`);

		reindexCollections({collectionIds});

		return coerseDocumentType(updatedNode);
	} // if documentType changed
	log.debug('No changes detected.');
	return coerseDocumentType(oldNode);
}
