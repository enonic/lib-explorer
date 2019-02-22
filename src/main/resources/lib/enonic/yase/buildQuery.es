//──────────────────────────────────────────────────────────────────────────────
// Enonic XP libs (externals not webpacked)
//──────────────────────────────────────────────────────────────────────────────
//import {toStr} from '/lib/enonic/util';


const buildFields = (fields) => `'${fields.map(({field, boost = ''}) =>
	`${field}${boost ? `^${boost}`: ''}`).join(',')}'`;


export function buildQuery({
	expression: {
		type,
		params
	},
	searchString
}) {
	/*log.info(toStr({
		type,
		params
	}));*/
	const operator = params.operator||'OR';
	let query = '';
	switch (type) {
	case 'fulltext':
		query = `fulltext(${buildFields(params.fields)}, '${searchString}', '${operator}')`;
		break;
	case 'ngram':
		query = `ngram(${buildFields(params.fields)}, '${searchString}', '${operator}')`;
		break;
	case 'group':
		query = `(${params.expressions.map(expression => buildQuery({expression, searchString})).join(` ${operator} `)})`;
		break;
	default:
		query = '';
	}
	//log.info(toStr({query}));
	return query;
} // function buildQuery
