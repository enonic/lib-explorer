import {
	QUERY_FUNCTION_NGRAM,
	forceArray//,
	//toStr
} from '@enonic/js-utils';

//@ts-ignore
import {connect} from '/lib/xp/node';

import {
	BRANCH_ID_EXPLORER,
	NT_INTERFACE,
	PATH_INTERFACES,
	PRINCIPAL_EXPLORER_READ,
	REPO_ID_EXPLORER
} from '/lib/explorer/constants';


const EXPLORER_READ_CONNECTION = connect({
	repoId: REPO_ID_EXPLORER,
	branch: BRANCH_ID_EXPLORER,
	principals: [PRINCIPAL_EXPLORER_READ]
});


function getInterface(key :string) {
	//log.info(toStr({key}));
	const node = EXPLORER_READ_CONNECTION.get(key);
	//log.info(toStr({node}));
	const {_name: id, displayName, _path: description} = node;
	return {id, displayName, description};
}


export function get({
	params: {
		count,
		//ids = '[]', // NOTE Json in Enonic XP 6.x
		ids = [],
		query = '',
		start
	}
}) {
	/*log.info(toStr({
		count, ids, query, start
	}));*/
	if (ids) {
		//const idArray = JSON.parse(ids); // Enonic XP 6.x
		const idArray = forceArray(ids); // Enonic XP 7.x
		if (idArray.length) {
			return {
				body: {
					count: ids.length,
					total: ids.length,
					hits: idArray.map(id => getInterface(`${PATH_INTERFACES}/${id}`))
				},
				contentType: 'text/json; charset=utf-8'
			};
		}
	} // if ids
	const queryParams = {
		count,
		filters: {
			boolean: {
				must: [{
					hasValue: {
						field: '_nodeType',
						values: [NT_INTERFACE]
					}
				}]
			}
		},
		query: query
			.split(' ')
			.map(word => `(
				fulltext('name^7, _name^5, displayName^3, _alltext^1', '${word}', 'OR')
				OR ${QUERY_FUNCTION_NGRAM}('name^6, _name^4, displayName^2, _alltext', '${word}', 'OR')
			)`)
			.join(' AND ')
			.replace(/\n\s*/g, ' ')
			.trim(),
		start
	}; //log.info(toStr({queryParams}));
	const result = EXPLORER_READ_CONNECTION.query(queryParams); //log.info(toStr({result}));
	const body = {
		count: result.count,
		total: result.total,
		hits: result.hits.map(({id}) => getInterface(id))
	}; //log.info(toStr({body}));
	return {
		body,
		contentType: 'text/json; charset=utf-8'
	};
}
