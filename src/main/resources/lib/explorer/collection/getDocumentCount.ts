import {addQueryFilter} from '@enonic/js-utils';
import {NT_DOCUMENT} from '/lib/explorer/constants';
import {connectToCollection} from '/lib/explorer/repo/connectToCollection';
import {hasValue} from '/lib/explorer/query/hasValue';
import {getTotal} from '/lib/explorer/query/getTotal';


export function getDocumentCount(name :string) {
	let count = -1;
	try {
		count = getTotal({
			connection: connectToCollection(name),
			filters: addQueryFilter({
				filter: hasValue('_nodeType', [NT_DOCUMENT])
			})
		});
	} catch (e) {
		if (e.class.name === 'com.enonic.xp.repository.RepositoryNotFoundException') {
			//noop
		} else {
			log.error('Does this ever happen?', e);
			// Yes: java.lang.IllegalArgumentException: RepositoryId format incorrect: com.enonic.app.explorer.collection.zsfgrH
		}
	}
	return count;
}
