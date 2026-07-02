// Ported from lib-guillotine /lib/guillotine/util/factory
import type {AnyObject} from '@enonic-types/lib-explorer';


const SUPPORTED_AGGREGATIONS = [
	'terms',
	'stats',
	'range',
	'dateRange',
	'dateHistogram',
	'geoDistance',
	'min',
	'max',
	'count'
] as const;


export interface AggregationInput extends AnyObject {
	name: string
	subAggregations?: AggregationInput[]
}


export function createAggregation(holder: AnyObject, aggregation: AggregationInput): AnyObject {
	const aggregationHolder: AnyObject = {};
	holder[aggregation.name] = aggregationHolder;

	SUPPORTED_AGGREGATIONS.some(aggregationName => {
		if (aggregation.hasOwnProperty(aggregationName)) {
			aggregationHolder[aggregationName] = aggregation[aggregationName];
			return true;
		}
		return false;
	});

	if (aggregation.subAggregations && aggregation.subAggregations.length > 0) {
		const subAggregationsHolder: AnyObject = {};
		aggregationHolder['aggregations'] = subAggregationsHolder;

		aggregation.subAggregations.forEach(subAggregation => {
			createAggregation(subAggregationsHolder, subAggregation);
		});
	}

	return holder;
}
