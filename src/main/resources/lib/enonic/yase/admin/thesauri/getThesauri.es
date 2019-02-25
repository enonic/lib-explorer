import {NT_THESAURUS} from '/lib/enonic/yase/constants';
import {connectRepo} from '/lib/enonic/yase/connectRepo';


export function getThesauri({
	connection = connectRepo()
} = {}) {
	const queryParams = {
		count: -1,
		filters: {
			boolean: {
				must: [{
					hasValue: {
						field: 'type',
						values: [NT_THESAURUS]
					}
				}]
			}
		},
		query: '', //"_parentPath = '/thesauri'",
		sort: '_name ASC'
	};
	const queryRes = connection.query(queryParams);
	const thesauri = queryRes.hits.map((hit) => {
		const {_name: name, description = '', displayName} = connection.get(hit.id);
		return {description, displayName, name};
	});
	return thesauri;
} // function getThesauri
