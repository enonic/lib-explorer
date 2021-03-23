export const filter = ({
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
} = {}) => ({
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
});

/*
import {toStr} from '/lib/util';

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
