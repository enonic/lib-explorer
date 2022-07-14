import type {RepoConnection} from '/lib/explorer/types/index.d';
import type {QuerySynonymsParams} from '/lib/explorer/synonym/query';
import type {SynonymsArray} from './index.d';


//import {toStr} from '@enonic/js-utils';
import {replaceSyntax} from '/lib/explorer/query/replaceSyntax';
import {ws} from '/lib/explorer/string/ws';
import {query as querySynonyms} from '/lib/explorer/synonym/query';
import {washSynonyms} from '/lib/explorer/synonym/washSynonyms';
import {query as queryThesauri} from '/lib/explorer/thesaurus/query';


const MAX_COUNT = 100;


export function getSynonymsFromSearchString({
	// Required
	explorerRepoReadConnection, // Connecting many places leeds to loss of control over principals, so pass a connection around.
	// Optional
	count = MAX_COUNT,
	expand = false,
	explain = false,
	searchString,
	showSynonyms = false,
	thesauri
} :{
	// Required
	explorerRepoReadConnection :RepoConnection
	// Optional
	count ?:number
	expand ?:boolean
	explain ?:boolean
	searchString ?:string
	showSynonyms ?:boolean
	thesauri ?:Array<string>
}) :SynonymsArray {
	if (!searchString || !thesauri) {
		return [];
	}

	const activeThesauri = queryThesauri({
		connection: explorerRepoReadConnection,
		//filters: , // TODO filter on languages?
		getSynonymsCount: false,
		thesauri
	}).hits.map(({_name}) => _name);
	//log.debug('activeThesauri:%s', toStr(activeThesauri));

	const querySynonymsParams :QuerySynonymsParams = {
		connection: explorerRepoReadConnection,
		count: count >= 1 && count <= MAX_COUNT ? count : MAX_COUNT,
		explain,
		//filters: addFilter({filter: hasValue('_parentPath', activeThesauri.map(n => `/thesauri/${n}`))}),
		query: {
			boolean: {
				must: {
					in: { // Limit which thesauri to search
						field: '_parentPath',
						values: activeThesauri.map(n => `/thesauri/${n}`)
					},
					fulltext: {
						fields: expand ? ['from', 'to'] : ['from'],
						operator: 'AND',
						query: ws(replaceSyntax({string: searchString}))
					}
				}/*, // Doesn't limit to a list of thesauri!
				should: activeThesauri.map(n => ({
					pathMatch: {
						//boost: ,
						field: '_parentPath',
						minimumMatch: 2,
						path: `/thesauri/${n}`
					}
				}))*/
			}
		},
		sort: {
			field: '_score',
			direction: 'DESC'
		}
	};
	//log.debug('querySynonymsParams:%s', toStr(querySynonymsParams));

	if (showSynonyms) {
		querySynonymsParams.highlight = {
			numberOfFragments: 10,
			postTag: '</b>',
			preTag: '<b>',
			properties: {
				from: {}
			}
		};
		if (expand) {
			querySynonymsParams.highlight.properties['to'] = {};
		}
	}
	//log.debug('querySynonymsParams:%s', toStr(querySynonymsParams));

	const querySynonymsRes = querySynonyms(querySynonymsParams);
	//log.debug('querySynonymsRes:%s', toStr(querySynonymsRes));

	return querySynonymsRes.hits.map(({
		_highlight,
		_score,
		from,
		thesaurus: thesaurusName,
		to
	}) => {
		//log.info(toStr({from, score, thesaurus, to}));
		return {
			from: from.map(s => washSynonyms(s)),
			_highlight,
			_score,
			thesaurusName,
			to: to.map(s => washSynonyms(s))
		};
	});
} // getSynonymsFromSearchString
