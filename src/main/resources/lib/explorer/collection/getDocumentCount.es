import {
	NT_DOCUMENT
} from '/lib/explorer/model/2/constants';
import {connectToCollection} from '/lib/explorer/repo/connectToCollection';
import {addFilter} from '/lib/explorer/query/addFilter';
import {hasValue} from '/lib/explorer/query/hasValue';
import {getTotal} from '/lib/explorer/query/getTotal';


export function getDocumentCount(name) {
	let count = -1;
	try {
		count = getTotal({
			connection: connectToCollection(name),
			filters: addFilter({
				filter: hasValue('_nodeType', [NT_DOCUMENT])
			})
		});
	} catch (e) {
		if (e.class.name === 'com.enonic.xp.repository.RepositoryNotFoundException') {
			//noop
		} else {
			log.error('Does this ever happen?', e);
		}
	}
	return count;
}
