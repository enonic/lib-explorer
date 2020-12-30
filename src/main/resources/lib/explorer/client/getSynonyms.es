import {toStr} from '/lib/util';
import {forceArray} from '/lib/util/data';

import {addFilter} from '/lib/explorer/query/addFilter';
import {hasValue} from '/lib/explorer/query/hasValue';
import {replaceSyntax} from '/lib/explorer/query/replaceSyntax';
//import {toWords} from '/lib/explorer/string/toWords';
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

	// Match synonyms where ANY word in search string matches ANY word in synonym
	//const query = `fulltext('${fields}', '${cleanSearchString}', 'OR')`;

	// Match synonyms where ALL words (may only be one word) in search string matches ANY word in synonym
	// NOTE: Used in prod for a long time...
	const query = `fulltext('${fields}', '${cleanSearchString}', 'AND')`;

	// Only match synonyms that start with...
	//const query = `from LIKE "${cleanSearchString}*"`;

	// Only match synonyms where any word in searchString matches WHOLE synonym
	//const words = toWords(cleanSearchString);
	//log.info(`words:${toStr(words)}`);
	//const query = `from IN (${words.map(word => `"${word}"`).join(', ')})`;

	// Only match synonyms EXACTLY
	//const query = `from = "${cleanSearchString}"`;

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
