import type {CustomEvent} from '@enonic/js-utils/types/index.d';
import type {DocumentTypeNode} from '../../types.d';


//@ts-ignore
import {newCache} from '/lib/cache';
import {
	EVENT_LISTEN_TYPE_CUSTOM_EXPLORER_DOCUMENTTYPE_CREATED,
	EVENT_LISTEN_TYPE_CUSTOM_EXPLORER_DOCUMENTTYPE_UPDATED//,
	//FIELD_PATH_META
} from '/lib/explorer/constants';
import {makeSchema} from '/lib/explorer/interface/graphql/makeSchema';
//@ts-ignore
import {listener} from '/lib/xp/event';


const SECONDS_TO_CACHE = 3600; // One hour


const schemaCache = newCache({
	size: 1,
	expire: SECONDS_TO_CACHE
});


export function getCachedSchema() {
	return schemaCache.get('static-key', () => {
		//log.debug('Caching a new Interface GraphQL Schema for %s seconds', SECONDS_TO_CACHE);
		return makeSchema();
	});
}


/*log.debug(
	'Starting event listener for %s and %s',
	EVENT_LISTEN_TYPE_CUSTOM_EXPLORER_DOCUMENTTYPE_CREATED,
	EVENT_LISTEN_TYPE_CUSTOM_EXPLORER_DOCUMENTTYPE_UPDATED
);*/
listener({
	type: 'custom.*',
	localOnly: false,
	callback: (event :CustomEvent<
		typeof EVENT_LISTEN_TYPE_CUSTOM_EXPLORER_DOCUMENTTYPE_CREATED
		|typeof EVENT_LISTEN_TYPE_CUSTOM_EXPLORER_DOCUMENTTYPE_UPDATED,
		DocumentTypeNode
	>) => {
		//log.debug('custom.* event:%s', toStr(event));
		const {type} = event;
		if (
			type === EVENT_LISTEN_TYPE_CUSTOM_EXPLORER_DOCUMENTTYPE_CREATED
			|| type === EVENT_LISTEN_TYPE_CUSTOM_EXPLORER_DOCUMENTTYPE_UPDATED
		) {
			//const {_id} = event.data;
			//log.debug('_id:%s', _id);
			//log.debug('Clearing cached Interface GraphQL Schema');
			schemaCache.clear();
		}
	}
});
