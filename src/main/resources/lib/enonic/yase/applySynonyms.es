//import {toStr} from '/lib/enonic/util';
import {forceArray} from '/lib/enonic/util/data';
import {NT_SYNONYM} from '/lib/enonic/yase/constants';
import {connect} from '/lib/enonic/yase/repo/connect';


function querySynonyms({
	connection = connect(),
	fields = 'from',
	searchString,
	thesauri
} = {}) {
	//log.info(toStr({fields, searchString, thesauri}));

	// ngram will quickly match a ton of synonyms, so don't use it.
	const query = `fulltext('${fields}', '${searchString}', 'OR')`;
	//log.info(toStr({query}));

	const queryParams = {
		count: -1,
		filters: {
			boolean: {
				must: [{
					hasValue: {
						field: '_parentPath',
						values: forceArray(thesauri).map(n => `/thesauri/${n}`)
					}
				}, {
					hasValue: {
						field: 'type',
						values: [NT_SYNONYM]
					}
				}]
			}
		},
		query
	};
	//log.info(toStr({queryParams}));

	const queryRes = connection.query(queryParams);
	//log.info(toStr({queryRes}));

	queryRes.hits = queryRes.hits.map(({id, score}) => {
		const node = connection.get(id);
		//log.info(toStr({node}));
		const {from, to} = node;
		return {
			id, from, score, to
		};
	});
	//log.info(toStr({queryRes}));

	return queryRes;
}


export function applySynonyms({
	expand = false,
	searchString,
	thesauri
}) {
	//log.info(toStr({searchString, thesauri}));

	if (!thesauri) { return searchString; }

	const synonyms = querySynonyms({
		fields: expand ? 'from,to' : 'from',
		searchString,
		thesauri
	}).hits;
	//log.info(toStr({synonyms}));

	if (expand) {
		return `${searchString}${synonyms
			.map(({from, to}) => ` ${from} ${to}`)
			.join('')
			.replace(/\s{2,}/g, ' ')
		}`;
	}

	return `${searchString}${synonyms
		.map(({to}) => ` ${to}`)
		.join('')
		.replace(/\s{2,}/g, ' ')
	}`;
}
