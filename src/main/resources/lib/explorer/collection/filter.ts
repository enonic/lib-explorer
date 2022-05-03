import type {CollectionNode} from '/lib/explorer/types/Collection.d';

export const filter = ({
	_id,
	_name,
	_path,
	_score,
	collector,
	creator,
	createdTime,
	doCollect,
	//documentCount, // not stored, added by graphql
	//interfaces, // not stored, added by graphql
	language,
	modifiedTime,
	modifier/*,
	type*/
} :CollectionNode) => ({
	_id,
	_name,
	_path,
	_score,
	collector,
	creator,
	createdTime,
	doCollect,
	//documentCount, // not stored, added by graphql
	//interfaces, // not stored, added by graphql
	language,
	modifiedTime,
	modifier/*,
	type*/
});

/*
import {toStr} from '@enonic/js-utils';

export function filter(collectionNode) {
	log.info(`collectionNode:${toStr(collectionNode)}`);
	const {
		_id,
		_name,
		_path,
		collector,
		creator,
		createdTime,
		cron,
		doCollect,
		//documentCount, // not stored, added by graphql
		//interfaces, // not stored, added by graphql
		language,
		modifiedTime,
		modifier,
		type
	} = collectionNode;
	const filteredCollectionNode = {
		_id,
		_name,
		_path,
		collector,
		creator,
		createdTime,
		cron,
		doCollect,
		//documentCount, // not stored, added by graphql
		//interfaces, // not stored, added by graphql
		language,
		modifiedTime,
		modifier,
		type
	};
	log.info(`filteredCollectionNode:${toStr(filteredCollectionNode)}`);
	return filteredCollectionNode;
} // filter
*/
