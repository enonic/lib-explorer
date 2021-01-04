//──────────────────────────────────────────────────────────────────────────────
// Enonic XP libs (externals not webpacked)
//──────────────────────────────────────────────────────────────────────────────
//import {toStr} from '/lib/util';

import {getSynonyms} from '/lib/explorer/client/getSynonyms';
import {flattenSynonyms} from '/lib/explorer/client/flattenSynonyms';
//import {partitionOnScore} from '/lib/explorer/search/synonyms/partitionOnScore';

//const {currentTimeMillis} = Java.type('java.lang.System');


const buildFields = (fields/*, score*/) => {
	return `'${fields.map(({field, boost = 1}) => {
		/*let floatBoost = parseFloat(boost);
		if (score) {
			floatBoost += floatBoost * score / 100;
		}
		floatBoost = floatBoost.toFixed();*/
		return `${field}${boost ? `^${boost}`: ''}`;
	}).join(',')}'`;
};


export function buildQuery({
	connection, // Connecting many places leeds to loss of control over principals, so pass a connection around.
	expand = false,
	explain,
	expression: {
		type,
		params
	},
	languages = [],
	logQuery = false,
	logQueryResults = false,
	//logSynonyms = false,
	searchString,
	synonyms//, // Gets modified
	//times
}) {
	/*log.info(toStr({
		connection,
		expand,
		type,
		params,
		searchString,
		synonyms
	}));*/
	//log.info(`languages:${toStr(languages)}`);
	const operator = params.operator||'AND';
	let query = '';
	switch (type) {
	case 'fulltext':
		query = `fulltext(${buildFields(params.fields)}, '${searchString}', '${operator}')`;
		//times.push({label: 'fulltext', time: currentTimeMillis()});
		break;
	case 'ngram':
		query = `ngram(${buildFields(params.fields)}, '${searchString}', '${operator}')`;
		//times.push({label: 'ngram', time: currentTimeMillis()});
		break;
	case 'synonyms': {
		const thesauri = params.thesauri;
		//if (logSynonyms) { log.info(`thesauri:${toStr(thesauri)}`); }
		const localSynonyms = getSynonyms({
			connection,
			expand,
			explain,
			languages,
			logQuery,
			logQueryResults,
			searchString, // TODO Perhaps stopwords needs to be removed here?
			thesauri
		});
		//times.push({label: 'getSynonyms', time: currentTimeMillis()});
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
			Object.keys(flattened).map(score => `fulltext(${buildFields(params.fields, score)}, '${flattened[score].join(' ')}', 'OR')`).join(' OR ')
		})`;*/

		const flattenedSynonyms = flattenSynonyms({
			expand,
			synonyms: localSynonyms
		}).map(s => `${s}`); // Removed double quotes https://enonic.zendesk.com/agent/tickets/3714

		//times.push({label: 'flattenSynonyms', time: currentTimeMillis()});
		//log.info(toStr({flattenedSynonyms}));
		/*const fields = buildFields(params.fields);
		query = `(${flattenedSynonyms.map(s => `fulltext(${fields}, '${s}', 'AND')`).join(' OR ')})`;*/

		query = `fulltext(${buildFields(params.fields)}, '${flattenedSynonyms.join(' ')}', 'OR')`;
		//times.push({label: 'synonyms', time: currentTimeMillis()});
		break;
	}
	case 'group':
		query = `(${params.expressions
			.map(expression =>
				buildQuery({
					connection,
					expression,
					explain,
					languages,
					logQuery,
					logQueryResults,
					//logSynonyms,
					searchString,
					synonyms/*, times*/
				})
			)
			.filter(x => x)
			.join(` ${operator} `)
		})`;
		break;
	case 'compareExpr':
		query = `${params.field} ${params.operator} '${params.valueExpr}'`;
		break;
	default:
		query = '';
	}
	//log.info(toStr({query}));
	return query;
} // function buildQuery
