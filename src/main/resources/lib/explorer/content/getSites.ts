//@ts-ignore
import {query as queryContent} from '/lib/xp/content';
//@ts-ignore
import {get as getContext, run} from '/lib/xp/context';


interface QueryContentParams {
	aggregations?: unknown;
	contentTypes?: Array<string>;
	count?: number;
	filters?: unknown;
	query?: string;
	sort?: string;
	start?: number;
}


export interface GetSitesParams {
	aggregations?: unknown;
	branch?: string;
	context?: Record<string, unknown>;
	count?: number;
	filters?: unknown;
	map?: (hit: unknown) => unknown;
	query?: string;
	sort?: string;
	start?: number;
}


export function getSites({
	aggregations,
	branch,
	context = (() => {
		const c = getContext() as unknown as Record<string, unknown>;
		if (branch) { c.branch = branch; }
		return c;
	})(),
	count = -1,
	filters,
	map,
	query,
	sort,
	start
}: GetSitesParams = {}) {
	const queryParams: QueryContentParams = {
		aggregations,
		count,
		contentTypes: ['portal:site'],
		filters,
		query,
		sort,
		start
	};

	const childRes = run(context, () => queryContent(queryParams));
	if (typeof map === 'function') {
		childRes.hits = childRes.hits.map((c: unknown) => map(c));
	}
	return childRes;
}
