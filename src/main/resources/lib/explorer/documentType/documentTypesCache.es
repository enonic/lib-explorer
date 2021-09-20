import {
	forceArray//,
	//toStr
} from '@enonic/js-utils';

import {newCache} from '/lib/cache';
import {getDocumentType} from '/lib/explorer/documentType/getDocumentType';
import {getCachedCollection} from '/lib/explorer/collection/collectionsCache';
import {getCachedField} from '/lib/explorer/field/fieldsCache';


const documentTypesByIdCache = newCache({
	size: 10, // Maximum number of items in the cache before it will evict the oldest.
	expire: 60 * 60 // Number of seconds the items will be in the cache before it’s evicted.
});


export function getCachedDocumentType({
	_id,
	refresh = false
}) {
	//log.debug(`getCachedDocumentType _id:${toStr(_id)} refresh:${toStr(refresh)}`);
	if (refresh) {
		documentTypesByIdCache.remove(_id);
	}
	return documentTypesByIdCache.get(_id, () => {
		const documentTypeNode = getDocumentType({_id});
		return documentTypeNode;
	});
}


export function getCachedDocumentTypeFromCollectionName({
	collectionName,
	refresh = false
}) {
	//log.debug(`getCachedDocumentTypeFromCollectionName collectionName:${toStr(collectionName)} refresh:${toStr(refresh)}`);
	const collectionNode = getCachedCollection({_name:collectionName});
	const {documentTypeId} = collectionNode;
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
	//log.debug(`getCachedDocumentTypeFromCollectionName documentTypeNode:${toStr(documentTypeNode)}`);
	return documentTypeNode;
}
