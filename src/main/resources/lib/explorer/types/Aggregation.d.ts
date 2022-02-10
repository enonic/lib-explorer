export interface TermsAggregation {
	terms: {
		field: string;
		order: string;
		size: number;
		minDocCount?: number;
	};
	aggregations?: {
		[subaggregation: string]: Aggregation;
	};
}

export interface StatsAggregation {
	stats: {
		field: string;
		order: string;
		size: number;
	};
	aggregations?: {
		[subaggregation: string]: Aggregation;
	};
}

export interface RangeAggregation {
	range: {
		field: string;
		ranges?: Array<{
			from?: number;
			to?: number;
		}>;
		range?: {
			from: number;
			to: number;
		};
	};
	aggregations?: {
		[subaggregation: string]: Aggregation;
	};
}

export interface GeoDistanceAggregation {
	geoDistance: {
		field: string;
		ranges?: Array<{
			from?: number;
			to?: number;
		}>;
		range?: {
			from: number;
			to: number;
		};
		unit: string;
		origin: {
			lat: string;
			lon: string;
		};
	};
	aggregations?: {
		[subaggregation: string]: Aggregation;
	};
}

export interface DateRangeAggregation {
	dateRange: {
		field: string;
		format: string;
		ranges: Array<{
			from?: string;
			to?: string;
		}>;
	};
	aggregations?: {
		[subaggregation: string]: Aggregation;
	};
}

export interface DateHistogramAggregation {
	dateHistogram: {
		field: string;
		interval: string;
		minDocCount: number;
		format: string;
	};
	aggregations?: {
		[subaggregation: string]: Aggregation;
	};
}

/**
* @since 7.7.0
*/
export interface MinAggregation {
	min: {
		field: string;
	};
	aggregations?: {
		[subaggregation: string]: Aggregation;
	};
}

/**
* @since 7.7.0
*/
export interface MaxAggregation {
	max: {
		field: string;
	};
	aggregations?: {
		[subaggregation: string]: Aggregation;
	};
}

/**
* @since 7.7.0
*/
export interface ValueCountAggregation {
	count: {
		field: string;
	};
	aggregations?: {
		[subaggregation: string]: Aggregation;
	};
}

export type Aggregation =
	| TermsAggregation
	| StatsAggregation
	| RangeAggregation
	| GeoDistanceAggregation
	| DateRangeAggregation
	| DateHistogramAggregation
	| MinAggregation
	| MaxAggregation
	| ValueCountAggregation;

export interface AggregationsResponseBucket {
	readonly docCount: number;
	readonly key: string;
	readonly from?: number | string;
	readonly to?: number | string;

	readonly [key2: string]: any; // sub aggregations
}

export interface AggregationsResponseEntry {
	readonly buckets: Array<AggregationsResponseBucket>;
}

export type AggregationsResponse<AggregationKey> = AggregationKey extends PropertyKey ? {
	[K in AggregationKey]: AggregationsResponseEntry;
} : {};
