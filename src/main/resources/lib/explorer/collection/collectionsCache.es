//import {toStr} from '@enonic/js-utils';

import {newCache} from '/lib/cache';
import {PRINCIPAL_EXPLORER_READ} from '/lib/explorer/model/2/constants';
import {connect} from '/lib/explorer/repo/connect';
import {get} from '/lib/explorer/collection/get';


const collectionsByIdCache = newCache({
	size: 10, // Maximum number of items in the cache before it will evict the oldest.
	expire: 60 * 60 // Number of seconds the items will be in the cache before it’s evicted.
});


const collectionsByNameCache = newCache({
	size: 10, // Maximum number of items in the cache before it will evict the oldest.
	expire: 60 * 60 // Number of seconds the items will be in the cache before it’s evicted.
});


export function getCachedCollection({
	_id,
	_name,
	refresh = false
}) {
	//log.debug(`getCachedCollection _id:${toStr(_id)} _name:${toStr(_name)} refresh:${toStr(refresh)}`);
	if (_id) {
		if (refresh) {
			collectionsByIdCache.remove(_id);
		}
		return collectionsByIdCache.get(_id, () => {
			const readConnection = connect({ principals: [PRINCIPAL_EXPLORER_READ] });
			const collectionNode = get({
				connection: readConnection,
				key: _id
			});
			return collectionNode;
		});
	}

	if (refresh) {
		collectionsByNameCache.remove(_name);
	}
	return collectionsByNameCache.get(_name, () => {
		const readConnection = connect({ principals: [PRINCIPAL_EXPLORER_READ] });
		const collectionNode = get({
			connection: readConnection,
			name: _name
		});
		return collectionNode;
	});
}
