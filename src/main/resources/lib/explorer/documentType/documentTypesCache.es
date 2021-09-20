/*

WARNING Cache remove is not cluster "safe"...

import {
	forceArray,
	toStr
} from '@enonic/js-utils';

import {newCache} from '/lib/cache';
import {getDocumentType} from '/lib/explorer/documentType/getDocumentType';
import {getCachedCollection} from '/lib/explorer/collection/collectionsCache';
import {getCachedField} from '/lib/explorer/field/fieldsCache';


const documentTypesByIdCache = newCache({
	size: 10, // Maximum number of items in the cache before it will evict the oldest.
	expire: 60 * 60 // Number of seconds the items will be in the cache before it’s evicted.
});


export function removeDocumentTypeFromCache({
	_id
}) {
	return documentTypesByIdCache.remove(_id);
}


export function getCachedDocumentType({
	_id,
	refresh = false
}) {
	log.debug(`getCachedDocumentType _id:${toStr(_id)} refresh:${toStr(refresh)}`);
	if (refresh) {
		documentTypesByIdCache.remove(_id);
	}
	//let inCache = true;
	const cachedDocumentTypeNode = documentTypesByIdCache.get(_id, () => {
		// NOTE This code doesn't run when in cache...
		//inCache = false;
		const documentTypeNode = getDocumentType({_id});
		//log.debug(`getCachedDocumentType documentTypeNode:${toStr(documentTypeNode)}`);
		return documentTypeNode;
	});
	//log.debug(`getCachedDocumentType inCache:${toStr(inCache)} cachedDocumentTypeNode:${toStr(cachedDocumentTypeNode)}`);
	return JSON.parse(JSON.stringify(cachedDocumentTypeNode)); // deref so it can't be modified
}


export function getCachedDocumentTypeFromCollectionName({
	collectionName,
	refresh = false
}) {
	//log.debug(`getCachedDocumentTypeFromCollectionName collectionName:${toStr(collectionName)} refresh:${toStr(refresh)}`);

	const collectionNode = getCachedCollection({_name:collectionName});
	//log.debug(`getCachedDocumentTypeFromCollectionName collectionNode:${toStr(collectionNode)}`);

	const {documentTypeId} = collectionNode;
	//log.debug(`getCachedDocumentTypeFromCollectionName documentTypeId:${toStr(documentTypeId)}`);
	if (!documentTypeId) {
		throw new Error(`Collection name:${collectionName} doesn't contain a documentTypeId!`);
	}

	const documentTypeNode = getCachedDocumentType({
		_id: documentTypeId,
		refresh
	});
	//log.debug(`getCachedDocumentTypeFromCollectionName documentTypeNode:${toStr(documentTypeNode)}`);

	documentTypeNode.fields = documentTypeNode.fields ? forceArray(documentTypeNode.fields).map(({
		active,
		fieldId
	}) => {
		return {
			...getCachedField({_id:fieldId}),
			_active: active
		};
	}) : [];
	//log.debug(`getCachedDocumentTypeFromCollectionName documentTypeNode mapped:${toStr(documentTypeNode)}`);
	return documentTypeNode;
}
*/
