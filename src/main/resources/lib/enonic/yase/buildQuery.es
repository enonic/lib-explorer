//──────────────────────────────────────────────────────────────────────────────
// Enonic XP libs (externals not webpacked)
//──────────────────────────────────────────────────────────────────────────────
import {toStr} from '/lib/enonic/util';

import {getSynonyms} from '/lib/enonic/yase/search/getSynonyms';
import {flattenSynonyms} from '/lib/enonic/yase/search/flattenSynonyms';


const buildFields = (fields) => `'${fields.map(({field, boost = ''}) =>
	`${field}${boost ? `^${boost}`: ''}`).join(',')}'`;


export function buildQuery({
	expand = false,
	expression: {
		type,
		params
	},
	searchString,
	synonyms // Gets modified
}) {
	/*log.info(toStr({
		expand,
		type,
		params,
		searchString,
		synonyms
	}));*/
	const operator = params.operator||'AND';
	let query = '';
	switch (type) {
	case 'fulltext':
		query = `fulltext(${buildFields(params.fields)}, '${searchString}', '${operator}', 'standard')`; // TODO Remove workaround in Enonic XP 7
		break;
	case 'ngram':
		query = `ngram(${buildFields(params.fields)}, '${searchString}', '${operator}')`;
		break;
	case 'synonyms':
		const localSynonyms = getSynonyms({
			expand,
			searchString,
			thesauri: params.thesauri
		});
		log.info(toStr({localSynonyms}));
		if (!localSynonyms.length) { return null; }
		localSynonyms.forEach(l => synonyms.push(l)); // Modify passed in array

		const flattenedSynonyms = flattenSynonyms({
			expand,
			synonyms: localSynonyms
		});
		log.info(toStr({flattenedSynonyms}));

		query = `fulltext(${buildFields(params.fields)}, '${flattenedSynonyms.join(' ')}', 'OR', 'standard')`; // TODO Remove workaround in Enonic XP 7
		break;
	case 'group':
		query = `(${params.expressions
			.map(expression =>
				buildQuery({expression, searchString, synonyms})
			)
			.filter(x => x)
			.join(` ${operator} `)
		})`;
		break;
	default:
		query = '';
	}
	//log.info(toStr({query}));
	return query;
} // function buildQuery
