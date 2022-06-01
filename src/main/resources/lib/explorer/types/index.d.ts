import type {CollectionId as ImportedCollectionId} from './Collection.d';
import type {CollectorId as ImportedCollectorId} from './Collector.d';


export namespace Explorer {
	export type CollectionId = ImportedCollectionId
	export type CollectorId = ImportedCollectorId
	export type Language = string
} // namespace Explorer


export namespace HttpClient {
	export type Method = 'GET'|'POST'|'PUT'|'DELETE'|'HEAD'|'PATCH'
	export type Request = {
		connectionTimeout ?:number
		body :string
		method :Method
		headers :Record<string,string>
		readTimeout :number
		url :string
	}
	export type Response = {
		body :string|null // Body of the response as string. Null if the response content-type is not of type text.
		contentType :string
		status :number
	}
} // namespace HttpClient


export type {
	Aggregation,
	Aggregations,
	AggregationsResponse,
	AggregationsResponseBucket,
	AggregationsResponseEntry,
	DateHistogramAggregation,
	DateRangeAggregation,
	GeoDistanceAggregation,
	MaxAggregation,
	MinAggregation,
	RangeAggregation,
	StatsAggregation,
	TermsAggregation,
	ValueCountAggregation
} from '@enonic/js-utils/src/types/node/query/Aggregation.d';
export type {
	PermissionsParams,
	PrincipalKey,
	PrincipalKeyRole,
	PrincipalKeyUser
} from '@enonic/js-utils/src/types/Auth.d';
export type {
	Highlight
} from '@enonic/js-utils/src/types/node/query/Highlight.d';
export type {
	CreateRepoParams,
	RepositoryConfig
} from '@enonic/js-utils/src/types/Repo.d';

export type {
	Collection,
	CollectionNode,
	CollectionNodeCreateParams,
	CollectionNodeSpecific,
	Cron,
	CollectionWithCron,
	QueriedCollection
} from './Collection.d';
export type {
	Collector
} from './Collector.d';
export type {
	GetContext
} from './Context.d';
export type {
	DocumentNode
} from './Document.d';
export type {
	DocumentType,
	DocumentTypeCreateParams,
	DocumentTypeField,
	DocumentTypeFields,
	DocumentTypeFieldsObject,
	DocumentTypeNode
} from './DocumentType.d';
export type {
	Field,
	FieldNode
} from './Field.d';
export type {
	QueryFilters
} from './Filters.d';
export type {
	IndexConfig,
	IndexConfigConfig,
	IndexConfigConfigsEntry,
	IndexConfigObject,
	IndexConfigTemplate
} from './IndexConfig.d';
export type {
	Journal,
	JournalError,
	JournalNode,
	JournalSuccess,
	JournalType
} from './Journal.d';
export type {
	ChildOrder,
	ExplorerAdminGQLInterfaceNodeCommonProps,
	Id,
	Key,
	MultiRepoConnectionQueryNode,
	Name,
	Node,
	NodeCreate,
	NodeCreateParams,
	NodeGetParams,
	NodeModifyParams,
	NodeType,
	ParentPath,
	Path,
	RequiredNodeProperties,
	ScoreOptional,
	ScoreRequired,
	State,
	TimeStamp,
	VersionKey
} from './Node.d';
export type {
	Interface,
	InterfaceSpecific,
	InterfaceField,
	InterfaceNode,
	InterfaceNodeCreateParams,
	InterfaceNodeSpecific
} from './Interface.d';
export type {
	Repo
} from './Repo.d';
export type {
	RepoConnection
} from './RepoConnection.d';
export type {
	EnonicXpRequest,
	HttpClientRequest
} from './Request.d';
export type {
	PageContributions,
	Response
} from './Response.d';
export type {
	ScheduledJob
} from './Scheduler.d';
export type {
	Stopword,
	StopwordNode
} from './Stopword.d';
export type {
	QueriedSynonym,
	Synonym,
	SynonymNode,
	SynonymNodeCreateParams
} from './Synonym.d';
export type {
	Task,
	TaskDescriptor,
	TaskName
} from './Task.d';
export type {
	Thesaurus,
	ThesaurusLanguage,
	ThesaurusNode,
	ThesaurusNodeCreateParams,
	ThesaurusSpecific
} from './Thesaurus.d';
export type {
	AnyObject,
	EmptyObject,
	OneOrMore,
	ZeroOrMore
} from './Utility.d';
export type {
	WriteConnection
} from './WriteConnection.d';
