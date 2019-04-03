//import {toStr} from '/lib/enonic/util';
import {forceArray} from '/lib/enonic/util/data';

import {addFilter} from '/lib/enonic/yase/query/addFilter';
import {hasValue} from '/lib/enonic/yase/query/hasValue';
import {replaceSyntax} from '/lib/enonic/yase/query/replaceSyntax';
import {ws} from '/lib/enonic/yase/string/ws';
import {query as querySynonyms} from '/lib/enonic/yase/synonym/query';


export function getSynonyms({
	count = 10,
	expand = false,
	searchString,
	thesauri
}) {
	//log.info(toStr({count, expand, searchString, thesauri}));
	const fields = expand ? 'from,to' : 'from';
	const cleanSearchString = ws(replaceSyntax({string: searchString}));

	// ngram will quickly match a ton of synonyms, so don't use it.
	const query = `fulltext('${fields}', '${cleanSearchString}', 'OR')`;
	//log.info(toStr({query}));

	const params = {
		count: count >= 1 && count <= 10 ? count : 10,
		filters: addFilter({filter: hasValue('_parentPath', forceArray(thesauri).map(n => `/thesauri/${n}`))}),
		query,
		sort: '_score DESC'
	};
	//log.info(toStr({params}));

	const hits = querySynonyms(params).hits;
	//log.info(toStr({hits}));

	const synonyms = [];
	hits.forEach(({from, to}) => {
		if (expand) {
			forceArray(from).forEach(f=>{
				if (!synonyms.includes(f)) {
					synonyms.push(f);
				}
			})
		}
		forceArray(to).forEach(t=>{
			if (!synonyms.includes(t)) {
				synonyms.push(t);
			}
		})
	});
	return synonyms;
} // getSynonyms
