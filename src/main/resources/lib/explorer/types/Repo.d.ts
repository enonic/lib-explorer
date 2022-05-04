export interface ElasticSearchIndexSettings {
	index?: {
		// static
		number_of_shards?: number;
		number_of_routing_shards?: number;
		check_on_startup?: boolean;
		codec?: unknown;
		routing_partition_size?: number;
		soft_deletes?: {
			enabled?: boolean;
			retention_lease?: {
				period?: string;
			};
		};
		load_fixed_bitset_filters_eagerly?: boolean;
		hidden?: boolean;

		// dynamic
		number_of_replicas?: number;
		auto_expand_replicas?: string | false;
		search?: {
			idle?: {
				after?: string;
			};
		};
		refresh_interval?: string;
		max_result_window?: number;
		max_inner_result_window?: number;
		max_rescore_window?: number;
		max_docvalue_fields_search?: number;
		max_script_fields?: number;
		max_ngram_diff?: number;
		max_shingle_diff?: number;
		max_refresh_listeners?: number;
		analyze?: {
			max_token_count?: number;
		};
		highlight?: {
			max_analyzed_offset?: number;
		};
		max_terms_count?: number;
		max_regex_length?: number;
		query?: {
			default_field?: string;
		};
		routing?: {
			allocation?: {
				enable?: "all" | "primaries" | "new_primaries" | "none";
			};
			rebalance?: {
				enable?: "all" | "primaries" | "new_primaries" | "none";
			};
		};
		gc_deletes?: string;
		default_pipeline?: string;
		final_pipeline?: string;
	};
	analysis?: {
		analyzer?: Record<
		string,
		{
			type?:
			| "standard"
			| "simple"
			| "whitespace"
			| "stop"
			| "keyword"
			| "pattern"
			| "fingerprint"
			| "custom"
			| string;
			tokenizer?: string;
			char_filter?: Array<string>;
			filter?: Array<string>;
			position_increment_gap?: number;
		}
		>;
	};
}

export interface IndexDefinition {
	settings: ElasticSearchIndexSettings;
	mapping: any;
}

export interface RepositorySettings {
	definitions?: {
		search?: IndexDefinition;
		version?: IndexDefinition;
		branch?: IndexDefinition;
	};
}

export interface Repo {
	id: string
	branches: Array<string>
	settings: RepositorySettings
}
