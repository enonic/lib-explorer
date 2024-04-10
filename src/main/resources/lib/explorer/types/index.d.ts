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
		// Required
		url: string
		// Optional
		auth?: {
			user: string
			password: string
		}
		body?: string|Record<string, unknown> // (string | object) Body content to send with the request, usually for POST or PUT requests. It can be of type string or stream.
		certificates?: unknown
		clientCertificate?: unknown
		connectionTimeout?: number
		contentType?: string
		disableHttp2?: boolean
		followRedirects?: boolean
		headers?: Record<string,string>
		method?: 'GET'|'POST'|'PUT'|'DELETE'|'HEAD'|'PATCH'
		multipart?: Record<string, unknown>[]
		params?: Record<string, string>
		proxy?: {
			host: string
			port: number
			user: string
			password: string
		}
		queryParams?: Record<string, string>
		readTimeout?: number
	}
	export type Response = {
		body: string|null // Body of the response as string. Null if the response content-type is not of type text.
		bodyStream?: unknown
		contentType: string
		status: number
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
} from '@enonic/js-utils/types/node/query/Aggregation.d';
export type {
	PermissionsParams,
	PrincipalKey,
	PrincipalKeyRole,
	PrincipalKeyUser
} from '@enonic/js-utils/types/Auth.d';
export type {
	Highlight
} from '@enonic/js-utils/types/node/query/Highlight.d';
export type {
	CreateRepoParams,
	RepositoryConfig
} from '@enonic/js-utils/types/Repo.d';

export type {
	Collection,
	CollectionFormValues,
	CollectionNode,
	CollectionNodeCreateParams,
	CollectionNodeSpecific,
	Cron,
	CollectionWithCron,
	QueriedCollection
} from './Collection.d';
export type {
	Collector,
	CollectorComponentAfterResetFunction,
	CollectorComponentImperativeHandle,
	CollectorComponentRef,
	CollectorComponentValidateFunction,
	CollectorProps,
	CollectorStateData,
	CollectorTaskConfig
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
	DocumentTypeNode,
	DocumentTypeNodeSpecific,
	DocumentTypesJson,
	DocumentTypesJsonDocumentType
} from './DocumentType.d';
export type {
	Field,
	FieldNode
} from './Field.d';
export type {
	QueryFilters
} from './Filters.d';
export type {
	GQL_InputType_Highlight
} from './GraphQL.d';
export type {
	IndexConfig,
	IndexConfigConfig,
	IndexConfigConfigsEntry,
	IndexConfigObject,
	IndexConfigTemplate
} from './IndexConfig.d';
export type {
	CreateJournalNodeParams,
	JournalInterface,
	JournalMessage,
	JournalNode,
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
	Notifications,
	NotificationsNode,
	NotificationsNodeCreateParams,
	NotificationsNodeSpecific
} from './Notifications.d';
export type {
	Interface,
	InterfaceSpecific,
	InterfaceField,
	InterfaceNode,
	InterfaceNodeCreateParams,
	InterfaceNodeSpecific,
	TermQuery,
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
	QueriedStopword,
	Stopword,
	StopwordNode
} from './Stopword.d';
export type {
	InputTypeLanguageSynonym,
	InputTypeSynonymLanguages,
	QueriedSynonym,
	Synonym,
	Synonym_Common,
	Synonym_Language,
	Synonym_LanguagesSynonymObject,
	SynonymGUI,
	SynonymGUI_Language,
	SynonymGUI_LanguagesSynonymObject,
	SynonymNode,
	SynonymNode_Languages,
	SynonymNode_LanguagesSynonymObject,
	SynonymNodeCreateParams,
	SynonymNodeModifyParams,
	SynonymUse,
	Write_SynonymNode_LanguagesSynonymObject
} from './Synonym.d';
export type {
	Task,
	TaskDescriptor,
	TaskName,
	TaskShouldType
} from './Task.d';
export type {
	Thesaurus,
	ThesaurusNode,
	ThesaurusNodeCreateParams,
	ThesaurusSpecific
} from './Thesaurus.d';
export type {
	AnyObject,
	EmptyObject,
	NestedRecordInterface,
	NestedRecordType,
	OneOrMore,
	ZeroOrMore
} from './Utility.d';
export type {
	WriteConnection
} from './WriteConnection.d';
