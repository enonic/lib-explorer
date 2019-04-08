//──────────────────────────────────────────────────────────────────────────────
// Enonic XP libs (externals not webpacked)
//──────────────────────────────────────────────────────────────────────────────
//import {toStr} from '/lib/enonic/util';

import {getSynonyms} from '/lib/enonic/yase/search/getSynonyms';
import {flattenSynonyms} from '/lib/enonic/yase/search/flattenSynonyms';
//import {partitionOnScore} from '/lib/enonic/yase/search/synonyms/partitionOnScore';


const buildFields = (fields/*, score*/) => {
	return `'${fields.map(({field, boost = 1}) => {
		/*let floatBoost = parseFloat(boost);
		if (score) {
			floatBoost += floatBoost * score / 100;
		}
		floatBoost = floatBoost.toFixed();*/
		return `${field}${boost ? `^${boost}`: ''}`;
	}).join(',')}'`;
}


export function buildQuery({
	connection, // Connecting many places leeds to loss of control over principals, so pass a connection around.
	expand = false,
	expression: {
		type,
		params
	},
	searchString,
	synonyms // Gets modified
}) {
	/*log.info(toStr({
		connection,
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
			connection,
			expand,
			searchString,
			thesauri: params.thesauri
		});
		//log.info(toStr({localSynonyms}));
		if (!localSynonyms.length) { return null; }
		localSynonyms.forEach(l => synonyms.push(l)); // Modify passed in array

		/*const partitioned = partitionOnScore(localSynonyms);
		log.info(toStr({partitioned}));

		const flattened = {};
		Object.keys(partitioned).map(score => {
			flattened[score] = flattenSynonyms({
				expand,
				synonyms: partitioned[score]
			}).map(s => `"${s}"`);
		});

		query = `(${
			Object.keys(flattened).map(score => `fulltext(${buildFields(params.fields, score)}, '${flattened[score].join(' ')}', 'OR', 'standard')`).join(' OR ')
		})`;*/

		const flattenedSynonyms = flattenSynonyms({
			expand,
			synonyms: localSynonyms
		}).map(s => `"${s}"`);
		//log.info(toStr({flattenedSynonyms}));

		query = `fulltext(${buildFields(params.fields)}, '${flattenedSynonyms.join(' ')}', 'OR', 'standard')`; // TODO Remove workaround in Enonic XP 7
		break;
	case 'group':
		query = `(${params.expressions
			.map(expression =>
				buildQuery({connection, expression, searchString, synonyms})
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
