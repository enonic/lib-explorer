import type {HighlightArray} from '/lib/explorer/interface/graphql/highlight/output/index.d';


export function queryResHighlightObjToArray({
	highlightObj
}: {
	highlightObj?: Record<string,string[]>
}): HighlightArray|null {
	if (!highlightObj) { return null; }
	const highlightArray = [];
	const keys = Object.keys(highlightObj);
	for (let i = 0; i < keys.length; i++) {
		const key = keys[i];
		highlightArray.push({
			field: key,
			highlights: highlightObj[key]
		});
	}
	return highlightArray;
}
