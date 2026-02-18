import type {
	HighlightResult
} from '@enonic-types/core';
import type {FieldSortDsl} from '/lib/xp/node';
import type {
	DocumentNode,
	GQL_InputType_Highlight,
	InterfaceField,
	TermQuery,
} from '../../../types.d';
import type { SynonymsArray } from '/lib/explorer/synonym/index.d';
import type { StemmingLanguageCode } from '@enonic/js-utils/types';


export type Profiling = {
	currentTimeMillis: number
	label: string
	operation: string
}

export type GraphQLContext = {
	// Required
	allowedInterfaces: string[]
	interfaceName: string
	//query: string
	// Optional
	logQuery?: boolean
	logQueryResult?: boolean
	logSynonymsQuery?: boolean
	logSynonymsQueryResult?: boolean
}

type AggregationsArg = Record<string, unknown>[] // TODO?
type FiltersArg = Record<string, unknown>[] // TODO?

export type InterfaceInfo = {
	collectionNameToId: Record<string,string>
	fields: InterfaceField[]
	interfaceId: string
	interfaceName: string
	localesInSelectedThesauri: string[]
	stemmingLanguages: StemmingLanguageCode[] // Can be an empty array
	stopWords: string[]
	thesauriNames: string[]
	termQueries?: TermQuery[]
};

//──────────────────────────────────────────────────────────────────────────────

export type QuerySynonymsResolverEnv = {
	args: {
		// Required
		searchString: string
		// Optional
		languages?: string[]
		profiling?: boolean
	}
	context: GraphQLContext
	source?: Record<string, unknown>; // Currently null
}

export type QuerySynonymsReturnType = {
	interfaceInfo?: InterfaceInfo // Used in backend, not returned to client
	languages?: string[]
	profiling?: Profiling[]
	searchString?: string // Used in backend, not returned to client
	synonyms: SynonymsArray
}

//──────────────────────────────────────────────────────────────────────────────

type SearchCommonArgs = {
	aggregations?: AggregationsArg
	filters?: FiltersArg
	highlight?: GQL_InputType_Highlight
	languages?: string[]
	profiling?: boolean
	// query?: QueryDsl
	searchString: string
	//synonyms?: SynonymsArray
	sort?: FieldSortDsl[]
}

export type SearchResolverSource = {
	interfaceInfo: InterfaceInfo // Used in backend, not returned to client
	languages?: string[]
	profiling?: Profiling[]
	searchString?: string
	synonyms?: SynonymsArray
}

export type SearchConnectionResolverEnv = {
	args: SearchCommonArgs & {
		after?: string
		first?: number
	}
	context: GraphQLContext
	source?: SearchResolverSource
}

export type SearchResolverEnv = {
	args: SearchCommonArgs & {
		count?: number
		start?: number
	}
	context: GraphQLContext
	source?: SearchResolverSource
}

export type Hit = {
	_collection: string
	//_collector?: string  // from FIELD_PATH_META
	//_collectorVersion?: string  // from FIELD_PATH_META
	_createdTime?: string // from FIELD_PATH_META
	_documentType?: string // from FIELD_PATH_META
	_highlight?: HighlightResult
	_json: DocumentNode
	_modifiedTime?: string // from FIELD_PATH_META
	//_language?: string // from FIELD_PATH_META
	_score: number
	//_stemmingLanguage?: string // from FIELD_PATH_META
}

export type SearchResolverReturnType = {
	// Required
	aggregationsAsJson: Record<string, unknown>;
	count: number
	hits: Hit[]
	start: number
	synonyms: SynonymsArray
	total: number
	// Optional
	profiling?: Profiling[]
}
