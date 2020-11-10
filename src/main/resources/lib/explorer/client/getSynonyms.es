import {toStr} from '/lib/util';
import {forceArray} from '/lib/util/data';

import {addFilter} from '/lib/explorer/query/addFilter';
import {hasValue} from '/lib/explorer/query/hasValue';
import {replaceSyntax} from '/lib/explorer/query/replaceSyntax';
import {ws} from '/lib/explorer/string/ws';
import {query as querySynonyms} from '/lib/explorer/synonym/query';
import {washSynonyms} from '/lib/explorer/client/washSynonyms';
//import {mapSynonyms} from '/lib/explorer/search/mapSynonyms';

const MAX_COUNT = 100;

export function getSynonyms({
	connection, // Connecting many places leeds to loss of control over principals, so pass a connection around.
	expand = false,
	explain = false,
	logQuery = false,
	logQueryResults = false,
	//logSynonyms = false,
	searchString,
	thesauri,
	count = MAX_COUNT//thesauri.length
}) {
	//log.info(toStr({connection, expand, searchString, thesauri, count}));
	if (!searchString || !thesauri) { return []; }

	const fields = expand ? 'from,to' : 'from';
	const cleanSearchString = ws(replaceSyntax({string: searchString}));
	//if (logSynonyms) { log.info(`cleanSearchString:${toStr(cleanSearchString)}`); }

	// ngram will quickly match a ton of synonyms, so don't use it.
	const query = `fulltext('${fields}', '${cleanSearchString}', 'AND')`;
	//if (logSynonyms) { log.info(`query:${toStr(query)}`); }

	const querySynonymsParams = {
		connection,
		count: count >= 1 && count <= MAX_COUNT ? count : MAX_COUNT,
		explain,
		filters: addFilter({filter: hasValue('_parentPath', forceArray(thesauri).map(n => `/thesauri/${n}`))}),
		query,
		sort: '_score DESC'
	};
	if (logQuery) {
		log.info(`querySynonymsParams:${toStr(querySynonymsParams)}`);
	}

	const querySynonymsRes = querySynonyms(querySynonymsParams);
	if (logQueryResults) {
		log.info(`querySynonymsRes:${toStr(querySynonymsRes)}`);
	}

	return querySynonymsRes.hits.map(({from, score, thesaurus, to}) => {
		//log.info(toStr({from, score, thesaurus, to}));
		return {
			from: forceArray(from).map(s => washSynonyms(s)),
			score,
			thesaurus,
			to: forceArray(to).map(s => washSynonyms(s))
		};
	});
	/*const obj = mapSynonyms({
		expand,
		searchString: cleanSearchString,
		from,
		to
	});
	if (!obj) { return null; }
	obj.thesaurus = _path.match(/[^/]+/g)[1];
	return obj;
	}).filter(x => x);*/
} // getSynonyms
