import {
	NT_DOCUMENT
} from '/lib/enonic/yase/constants';
import {connectToCollection} from '/lib/enonic/yase/repo/connectToCollection';
import {addFilter} from '/lib/enonic/yase/query/addFilter';
import {hasValue} from '/lib/enonic/yase/query/hasValue';
import {getTotal} from '/lib/enonic/yase/query/getTotal';


export function getDocumentCount({
	collectionName
}) {
	let count = -1;
	try {
		count = getTotal({
			connection: connectToCollection(collectionName),
			filters: addFilter({
				filter: hasValue('type', [NT_DOCUMENT])
			})
		});
	} catch (e) {
		//noop
	}
	return count;
}
