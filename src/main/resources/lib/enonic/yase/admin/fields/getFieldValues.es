import {NT_FIELD_VALUE} from '/lib/enonic/yase/constants';
import {connect} from '/lib/enonic/yase/repo/connect';


export function getFieldValues({
	connection = connect(),
	field
} = {}) {
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
