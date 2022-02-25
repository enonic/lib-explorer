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


export type AggregationsResponseBucket<SubAggregationKey = never> = SubAggregationKey extends PropertyKey
	? {
		[K in SubAggregationKey] :{
			readonly buckets? :ReadonlyArray<AggregationsResponseBucket<SubAggregationKey>>;

			// Max, Min, Value Count
			readonly value? :number

			// Stats
			readonly avg? :number
			readonly count? :number
			readonly max? :number
			readonly min? :number
			readonly sum? :number
		}
	} & {
		// DateHistogram, DateRange, GeoDistance, Range, Term
		readonly docCount: number; // doc_count??? https://developer.enonic.com/docs/xp/stable/storage/aggregations#geodistance
		readonly key: string;

		// DateRange, Range
		readonly from?: number | string;
		readonly to?: number | string;
	}
	: {
		// DateHistogram, DateRange, GeoDistance, Range, Term
		readonly docCount: number; // doc_count??? https://developer.enonic.com/docs/xp/stable/storage/aggregations#geodistance
		readonly key: string;

		// DateRange, Range
		readonly from?: number | string;
		readonly to?: number | string;
	}


/*export interface AggregationsResponseBucket {
	// DateHistogram, DateRange, GeoDistance, Range, Term
	readonly docCount: number; // doc_count??? https://developer.enonic.com/docs/xp/stable/storage/aggregations#geodistance
	readonly key: string;

	// DateRange, Range
	readonly from?: number | string;
	readonly to?: number | string;

	[key2 in SubAggregationKey] :{
		readonly buckets? :ReadonlyArray<AggregationsResponseBucket>;

		// Max, Min, Value Count
		readonly value? :number

		// Stats
		readonly avg? :number
		readonly count? :number
		readonly max? :number
		readonly min? :number
		readonly sum? :number
	} | any;
}*/

export interface AggregationsResponseEntry<SubAggregationKey = never> {
	readonly buckets :Array<AggregationsResponseBucket<SubAggregationKey>>;

	// Max, Min, Value Count
	readonly value? :number

	// Stats
	readonly avg? :number
	readonly count? :number
	readonly max? :number
	readonly min? :number
	readonly sum? :number
}

export type AggregationsResponse<AggregationKey = never, SubAggregationKey = never> = AggregationKey extends PropertyKey ? {
	[K in AggregationKey] :AggregationsResponseEntry<SubAggregationKey>;
} : {};
