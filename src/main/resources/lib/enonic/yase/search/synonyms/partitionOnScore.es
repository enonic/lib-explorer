//import groupBy from 'lodash/groupBy';

function groupBy(list, iteratee) {
	const obj = {};
	list.forEach((item) => {
		const key = iteratee(item);
		if (!obj[key]) { obj[key] = []; }
		obj[key].push(item);
	});
	return obj;
}


export function partitionOnScore(synonyms) {
	return groupBy(synonyms, ({score}) => score);
}
