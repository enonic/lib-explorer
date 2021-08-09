import {
	COLON_SIGN,
	DOT_SIGN,
	VALUE_TYPE_BOOLEAN,
	VALUE_TYPE_INSTANT,
	VALUE_TYPE_SET,
	VALUE_TYPE_STRING
} from '@enonic/js-utils';

//──────────────────────────────────────────────────────────────────────────────
// Admin tool
//──────────────────────────────────────────────────────────────────────────────
export const APP_EXPLORER = 'com.enonic.app.explorer';

//──────────────────────────────────────────────────────────────────────────────
// Folders
//──────────────────────────────────────────────────────────────────────────────
export const INTERFACES_FOLDER = 'interfaces';

export const FOLDERS = [
	'api-keys',
	'collections',
	'collectors',
	'fields',
	INTERFACES_FOLDER,
	'notifications',
	'stopwords',
	'thesauri'
];

//──────────────────────────────────────────────────────────────────────────────
// Node types
//──────────────────────────────────────────────────────────────────────────────
export const NT_API_KEY = `${APP_EXPLORER}${COLON_SIGN}api-key`;
export const NT_COLLECTION = `${APP_EXPLORER}${COLON_SIGN}collection`;
export const NT_COLLECTOR = `${APP_EXPLORER}${COLON_SIGN}collector`;
export const NT_DOCUMENT = `${APP_EXPLORER}${COLON_SIGN}document`;
export const NT_FIELD = `${APP_EXPLORER}${COLON_SIGN}field`;
export const NT_FIELD_VALUE = `${APP_EXPLORER}${COLON_SIGN}field-value`; // TODO Remove in lib-explorer-5.0.0?
export const NT_FOLDER = `${APP_EXPLORER}${COLON_SIGN}folder`;
export const NT_INTERFACE = `${APP_EXPLORER}${COLON_SIGN}interface`;
export const NT_JOURNAL = `${APP_EXPLORER}${COLON_SIGN}journal`;
//export const NT_KEYWORD = `${APP_EXPLORER}${COLON_SIGN}keyword`;
export const NT_RESPONSE = `${APP_EXPLORER}${COLON_SIGN}response`;
export const NT_STOP_WORDS = `${APP_EXPLORER}${COLON_SIGN}stop-words`;
export const NT_SYNONYM = `${APP_EXPLORER}${COLON_SIGN}synonym`;
//export const NT_TAG = `${APP_EXPLORER}${COLON_SIGN}tag`;
export const NT_THESAURUS = `${APP_EXPLORER}${COLON_SIGN}thesaurus`;

export const INDEX_CONFIG_STOP_WORDS = {default: 'byType'};

//──────────────────────────────────────────────────────────────────────────────
// Various
//──────────────────────────────────────────────────────────────────────────────
export const PATH_API_KEYS = '/api-keys';
export const PATH_COLLECTORS = '/collectors';
export const PATH_FIELDS = '/fields';
export const PATH_INTERFACES = '/interfaces';

export const FIELD_MODIFIED_TIME_INDEX_CONFIG = 'minimal';

export const NO_VALUES_FIELDS = [{
	key: '_allText',
	_name: 'alltext', // sanitize removes _ and makes T small
	denyDelete: true, // TODO: Only used in Fields.jsx and FieldList.es
	denyValues: true, // TODO: Only used in Fields.jsx and FieldList.es
	//displayName: 'All text',
	inResults: false // TODO: Only used in servics/interfaceList.es
},{
	_name: 'document-metadata', // sanitize make _ into -
	denyDelete: true,
	denyValues: true,
	fieldType: VALUE_TYPE_SET,
	indexConfig: 'minimal',
	inResults: false,
	key: 'document_metadata',
	max: 1,
	min: 1
},{
	_name: 'document-metadata.collector', // sanitize make _ into -
	denyDelete: true,
	denyValues: true,
	fieldType: VALUE_TYPE_SET,
	indexConfig: 'minimal',
	inResults: false,
	key: 'document_metadata.collector',
	max: 1,
	min: 0
},{
	_name: 'document-metadata.collector.id', // sanitize make _ into -
	denyDelete: true,
	denyValues: true,
	fieldType: VALUE_TYPE_STRING,
	indexConfig: 'minimal',
	inResults: false,
	key: 'document_metadata.collector.id',
	max: 1,
	min: 0
},{
	_name: 'document-metadata.collector.version', // sanitize make _ into -
	denyDelete: true,
	denyValues: true,
	fieldType: VALUE_TYPE_STRING,
	indexConfig: 'minimal',
	inResults: false,
	key: 'document_metadata.collector.version',
	max: 1,
	min: 0
},{
	_name: 'document-metadata.createdTime', // sanitize make _ into -
	denyDelete: true,
	denyValues: true,
	fieldType: VALUE_TYPE_INSTANT,
	indexConfig: 'minimal',
	inResults: false,
	key: 'document_metadata.createdTime',
	max: 1,
	min: 1
},{
	_name: 'document-metadata.modifiedTime', // sanitize make _ into -
	denyDelete: true,
	denyValues: true,
	fieldType: VALUE_TYPE_INSTANT,
	indexConfig: FIELD_MODIFIED_TIME_INDEX_CONFIG,
	inResults: false,
	key: 'document_metadata.modifiedTime',
	max: 1,
	min: 0
},{
	_name: 'document-metadata.valid', // sanitize make _ into -
	denyDelete: true,
	denyValues: true,
	fieldType: VALUE_TYPE_BOOLEAN,
	indexConfig: 'minimal',
	inResults: false,
	key: 'document_metadata.valid',
	max: 1,
	min: 1
}];

export const READONLY_FIELDS = [{
	key: '_nodeType',
	_name: 'underscore-nodetype', // sanitize removes _ and makes T small
	denyDelete: true,
	denyValues: false,
	//displayName: 'Type',
	fieldType: VALUE_TYPE_STRING,
	indexConfig: 'minimal',
	max: 1,
	min: 1
},{ // TODO This should not be a system field. Remove in lib-explorer-4.0.0?
	key: 'type',
	_name: 'type',
	denyDelete: true,
	denyValues: false,
	fieldType: VALUE_TYPE_STRING,
	indexConfig: 'minimal',
	max: 1,
	min: 0
	//displayName: 'Type'
}];

export const READWRITE_FIELDS = [{
	key: 'title',
	_name: 'title',
	denyDelete: true,
	denyValues: false,
	//displayName: 'Title'*/
	fieldType: VALUE_TYPE_STRING,
	indexConfig: 'fulltext', // includes ngram
	max: 1,
	min: 1 // TODO: There may exist pages without title, should we allow that?
},{
	key: 'language',
	_name: 'language',
	denyDelete: true,
	denyValues: false,
	//displayName: 'Language'*/
	fieldType: VALUE_TYPE_STRING,
	indexConfig: 'type',
	max: 0,
	min: 0
},{
	key: 'text',
	_name: 'text',
	denyDelete: true,
	denyValues: false,
	//displayName: 'Text'
	fieldType: VALUE_TYPE_STRING,
	indexConfig: 'fulltext', // includes ngram
	max: 0, // Allow array
	min: 1
},{
	key: 'uri',
	_name: 'uri',
	denyDelete: true,
	denyValues: false,
	//displayName: 'Uri'
	fieldType: VALUE_TYPE_STRING,
	indexConfig: {
		enabled: true,
		decideByType: false, // Assume text
		nGram: false, // Don't need ngram for uri
		fulltext: true, // But fulltext is used by a customer
		includeInAllText: false, // Nope
		path: false
	},
	max: 1,
	min: 1
}];

export const SYSTEM_FIELDS = NO_VALUES_FIELDS.concat(READONLY_FIELDS);
export const DEFAULT_FIELDS = NO_VALUES_FIELDS.concat(READONLY_FIELDS, READWRITE_FIELDS);

//──────────────────────────────────────────────────────────────────────────────
// Repo
//──────────────────────────────────────────────────────────────────────────────

export const REPO_ID_EXPLORER = APP_EXPLORER;
export const BRANCH_ID_EXPLORER = 'master';
export const REPO_JOURNALS = `${APP_EXPLORER}${DOT_SIGN}journals`;

export const COLLECTION_REPO_PREFIX = `${APP_EXPLORER}${DOT_SIGN}collection${DOT_SIGN}`;
export const RESPONSES_REPO_PREFIX = `${APP_EXPLORER}${DOT_SIGN}responses${DOT_SIGN}`;


//──────────────────────────────────────────────────────────────────────────────
// Roles
//──────────────────────────────────────────────────────────────────────────────
export const ROLE_SYSTEM_ADMIN = 'system.admin';
export const ROLE_EXPLORER_ADMIN = `${APP_EXPLORER}.admin`;
export const ROLE_EXPLORER_READ = `${APP_EXPLORER}.read`;
export const ROLE_EXPLORER_WRITE = `${APP_EXPLORER}.write`;


//──────────────────────────────────────────────────────────────────────────────
// Principals
//──────────────────────────────────────────────────────────────────────────────
export const PRINCIPAL_SYSTEM_ADMIN = `role:${ROLE_SYSTEM_ADMIN}`;
export const PRINCIPAL_EXPLORER_READ = `role:${ROLE_EXPLORER_READ}`;
export const PRINCIPAL_EXPLORER_WRITE = `role:${ROLE_EXPLORER_WRITE}`;


//──────────────────────────────────────────────────────────────────────────────
// User
//──────────────────────────────────────────────────────────────────────────────
export const USER_EXPLORER_APP_NAME = APP_EXPLORER;
export const USER_EXPLORER_APP_ID_PROVIDER = 'system';
export const USER_EXPLORER_APP_KEY = `user:${USER_EXPLORER_APP_ID_PROVIDER}:${USER_EXPLORER_APP_NAME}`;


//──────────────────────────────────────────────────────────────────────────────
// Root Permissions
//──────────────────────────────────────────────────────────────────────────────
export const ROOT_PERMISSION_SYSTEM_ADMIN = {
	principal: PRINCIPAL_SYSTEM_ADMIN,
	allow: [
		'READ',
		'CREATE',
		'MODIFY',
		'DELETE',
		'PUBLISH',
		'READ_PERMISSIONS',
		'WRITE_PERMISSIONS'
	],
	deny: []
};

export const ROOT_PERMISSION_EXPLORER_WRITE = {
	principal: PRINCIPAL_EXPLORER_WRITE,
	allow: [
		'READ',
		'CREATE',
		'MODIFY',
		'DELETE'
	],
	deny: []
};

export const ROOT_PERMISSION_EXPLORER_READ = {
	principal: PRINCIPAL_EXPLORER_READ,
	allow: ['READ'],
	deny: []
};

export const ROOT_PERMISSIONS_EXPLORER = [
	ROOT_PERMISSION_SYSTEM_ADMIN,
	ROOT_PERMISSION_EXPLORER_WRITE,
	ROOT_PERMISSION_EXPLORER_READ
];

//──────────────────────────────────────────────────────────────────────────────
// Events
//──────────────────────────────────────────────────────────────────────────────
export const EVENT_COLLECTOR_UNREGISTER = `${APP_EXPLORER}.collector.unregister`; // TODO Unused in lib-explorer-4.0.0 remove?
