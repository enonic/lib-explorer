//import {toStr} from '@enonic/js-utils';

import {newCache} from '/lib/cache';
import {getField} from '/lib/explorer/field/getField';
import {PRINCIPAL_EXPLORER_READ} from '/lib/explorer/model/2/constants';
import {connect} from '/lib/explorer/repo/connect';


const fieldsByIdCache = newCache({
	size: 10, // Maximum number of items in the cache before it will evict the oldest.
	expire: 60 * 60 // Number of seconds the items will be in the cache before it’s evicted.
});


export function getCachedField({
	_id,
	refresh = false
}) {
	//log.debug(`getCachedField _id:${toStr(_id)} refresh:${toStr(refresh)}`);
	if (refresh) {
		fieldsByIdCache.remove(_id);
	}
	return fieldsByIdCache.get(_id, () => {
		const readConnection = connect({ principals: [PRINCIPAL_EXPLORER_READ] });
		const fieldNode = getField({
			connection: readConnection,
			key: _id
		});
		//log.debug(`getCachedField fieldNode:${toStr(fieldNode)}`);
		return fieldNode;
	});
}
