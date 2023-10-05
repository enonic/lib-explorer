// import type {QueryDsl} from '/lib/xp/node';
import type {
	AnyObject,
	DocumentNode,
	InterfaceField
} from '/lib/explorer/types/index.d';
import type {Highlight} from '../highlight/input/index.d';
//import type {HighlightArray} from '../highlight/output/index.d';
import type {SynonymsArray} from '/lib/explorer/synonym/index.d';
import type {TermQuery} from '/lib/explorer/types/Interface.d';
import type { StemmingLanguageCode } from '@enonic/js-utils/types';


export type {EmptyObject} from '/lib/explorer/types/index.d';


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

type AggregationsArg = AnyObject[] // TODO?
type FiltersArg = AnyObject[] // TODO?

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
	source?: AnyObject // Currently null
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
	highlight?: Highlight
	languages?: string[]
	profiling?: boolean
	// query?: QueryDsl
	searchString: string
	//synonyms?: SynonymsArray
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
	_highlight?: Record<string,string[]>
	//_highlight?: HighlightArray
	_json: DocumentNode
	_modifiedTime?: string // from FIELD_PATH_META
	//_language?: string // from FIELD_PATH_META
	_score: number
	//_stemmingLanguage?: string // from FIELD_PATH_META
}

export type SearchResolverReturnType = {
	// Required
	aggregationsAsJson: AnyObject
	count: number
	hits: Hit[]
	start: number
	synonyms: SynonymsArray
	total: number
	// Optional
	profiling?: Profiling[]
}
