import {NT_FIELD_VALUE} from '/lib/enonic/yase/constants';
import {connectRepo} from '/lib/enonic/yase/connectRepo';


export function getFieldValues({
	connection = connectRepo(),
	field
}) {
	const must = [{
		hasValue: {
			field: 'type',
			values: [NT_FIELD_VALUE]
		}
	}];
	if (field) {
		must.push({
			hasValue: {
				field: '_parentPath',
				values: [`/fields/${field}`]
			}
		}/*{
			hasValue: {
				field: 'field',
				values: [field]
			}
		}*/);
	}
	const queryParams = {
		count: -1,
		filters: {
			boolean: {
				must
			}
		},
		query: '',
		sort: '_name ASC'
	};
	const queryRes = connection.query(queryParams);
	queryRes.hits = queryRes.hits.map(hit => connection.get(hit.id));
	return queryRes;
}
