import {
	COLON_SIGN,
	DOT_SIGN,
	INDEX_CONFIG_N_GRAM,
	VALUE_TYPE_BOOLEAN,
	//VALUE_TYPE_DOUBLE,
	VALUE_TYPE_INSTANT,
	//VALUE_TYPE_REFERENCE,
	VALUE_TYPE_SET,
	VALUE_TYPE_STRING
} from '@enonic/js-utils';

export {
	APP_EXPLORER,
	BRANCH_ID_EXPLORER,
	FIELD_PATH_GLOBAL,
	FIELD_PATH_META,
	PRINCIPAL_EXPLORER_READ,
	PRINCIPAL_EXPLORER_WRITE,
	REPO_ID_EXPLORER,
	ROLE_EXPLORER_READ,
	ROLE_EXPLORER_WRITE
} from '../../constants';

//──────────────────────────────────────────────────────────────────────────────
// Folders
//──────────────────────────────────────────────────────────────────────────────
export const INTERFACES_FOLDER = 'interfaces';
const FOLDER_API_KEYS = 'api-keys';
const FOLDER_COLLECTORS = 'collectors';
const FOLDER_FIELDS = 'fields';

export const FOLDERS = [
	FOLDER_API_KEYS,
	'collections',
	FOLDER_COLLECTORS,
	FOLDER_FIELDS,
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
// Node paths
//──────────────────────────────────────────────────────────────────────────────
export const PATH_API_KEYS = `/${FOLDER_API_KEYS}`;
export const PATH_COLLECTORS = `/${FOLDER_COLLECTORS}`;
export const PATH_FIELDS = `/${FOLDER_FIELDS}`;
export const PATH_INTERFACES = `/${INTERFACES_FOLDER}`;

//──────────────────────────────────────────────────────────────────────────────
// Field paths (Namespaces)
//──────────────────────────────────────────────────────────────────────────────
export const DOCUMENT_METADATA = 'document_metadata'; // Deprecated, should not be used anywhere
const FIELD_PATH_META_SANITIZED = 'document-metadata'; // sanitize make _ into -

//──────────────────────────────────────────────────────────────────────────────
// Fields / indexConfig
//──────────────────────────────────────────────────────────────────────────────
export const FIELD_MODIFIED_TIME_INDEX_CONFIG = 'minimal';

export const FIELD_DOCUMENT_METADATA_LANGUAGE_INDEX_CONFIG = {
	decideByType: false, // Assume it's always VALUE_TYPE_STRING
	enabled: true, // So it can be used in filters
	fulltext: false,
	includeInAllText: false,
	languages: [],
	[INDEX_CONFIG_N_GRAM]: false,
	path: false
};

export const FIELD_DOCUMENT_METADATA_STEMMING_LANGUAGE_INDEX_CONFIG = {
	decideByType: false, // Assume it's always VALUE_TYPE_STRING
	enabled: true, // So it can be used in filters
	fulltext: false,
	includeInAllText: false,
	languages: [],
	[INDEX_CONFIG_N_GRAM]: false,
	path: false
};

// NO_VALUES_FIELDS are included in SYSTEM_FIELDS which are fields that do not exist as nodes in explorer-repo.
export const NO_VALUES_FIELDS = [{
	key: '_allText',
	_name: 'alltext', // sanitize removes _ and makes T small
	denyDelete: true, // TODO: Only used in Fields.jsx and FieldList.es
	denyValues: true, // TODO: Only used in Fields.jsx and FieldList.es
	//displayName: 'All text',
	fieldType: VALUE_TYPE_STRING,
	inResults: false // Used in interface/GraphQL and services/interfaceList.es
},{
	_name: FIELD_PATH_META_SANITIZED, // sanitize make _ into -
	denyDelete: true,
	denyValues: true,
	fieldType: VALUE_TYPE_SET,
	indexConfig: 'minimal',
	inResults: false,
	key: FIELD_PATH_META,
	max: 1,
	min: 1
},{
	_name: `${FIELD_PATH_META_SANITIZED}.collector`, // sanitize make _ into -
	denyDelete: true,
	denyValues: true,
	fieldType: VALUE_TYPE_SET,
	indexConfig: 'minimal',
	inResults: false,
	key: `${FIELD_PATH_META}.collector`,
	max: 1,
	min: 0
},{
	_name: `${FIELD_PATH_META_SANITIZED}.collector.id`, // sanitize make _ into -
	denyDelete: true,
	denyValues: true,
	fieldType: VALUE_TYPE_STRING,
	indexConfig: 'minimal',
	inResults: false,
	key: `${FIELD_PATH_META}.collector.id`,
	max: 1,
	min: 0
},{
	_name: `${FIELD_PATH_META_SANITIZED}.collector.version`, // sanitize make _ into -
	denyDelete: true,
	denyValues: true,
	fieldType: VALUE_TYPE_STRING,
	indexConfig: 'minimal',
	inResults: false,
	key: `${FIELD_PATH_META}.collector.version`,
	max: 1,
	min: 0
},/*{
	_name: `${FIELD_PATH_META_SANITIZED}.collection`, // sanitize make _ into -
	denyDelete: true,
	denyValues: true,
	fieldType: VALUE_TYPE_SET,
	indexConfig: 'minimal',
	inResults: false,
	key: `${FIELD_PATH_META}.collection`,
	max: 1,
	min: 1
},{
	_name: `${FIELD_PATH_META_SANITIZED}.collection.id`, // sanitize make _ into -
	denyDelete: true,
	denyValues: true,
	fieldType: VALUE_TYPE_REFERENCE,
	indexConfig: 'minimal',
	inResults: false,
	key: `${FIELD_PATH_META}.collection.id`,
	max: 1,
	min: 1
},*/{
	_name: `${FIELD_PATH_META_SANITIZED}.collection`, // sanitize make _ into -
	denyDelete: true,
	denyValues: true,
	fieldType: VALUE_TYPE_STRING,
	indexConfig: 'minimal',
	inResults: true,
	key: `${FIELD_PATH_META}.collection`,
	max: 1,
	min: 1
},{
	_name: `${FIELD_PATH_META_SANITIZED}.createdTime`, // sanitize make _ into -
	denyDelete: true,
	denyValues: true,
	fieldType: VALUE_TYPE_INSTANT,
	indexConfig: 'minimal',
	inResults: false,
	key: `${FIELD_PATH_META}.createdTime`,
	max: 1,
	min: 1
},/*{
	_name: `${FIELD_PATH_META_SANITIZED}.documentType`, // sanitize make _ into -
	denyDelete: true,
	denyValues: true,
	fieldType: VALUE_TYPE_SET,
	indexConfig: 'minimal',
	inResults: false,
	key: `${FIELD_PATH_META}.documentType`,
	max: 1,
	min: 1
},{
	_name: 'document-metadata.documentType.id', // sanitize make _ into -
	denyDelete: true,
	denyValues: true,
	fieldType: VALUE_TYPE_REFERENCE,
	indexConfig: 'minimal',
	inResults: false,
	key: `${FIELD_PATH_META}.documentType.id`,
	max: 1,
	min: 1
},*/{
	_name: 'document-metadata.documentType', // sanitize make _ into -
	denyDelete: true,
	denyValues: true,
	fieldType: VALUE_TYPE_STRING,
	indexConfig: 'minimal',
	inResults: true,
	key: `${FIELD_PATH_META}.documentType`,
	max: 1,
	min: 1
},{
	_name: `${FIELD_PATH_META_SANITIZED}.language`, // sanitize make _ into -
	denyDelete: true,
	denyValues: true,
	fieldType: VALUE_TYPE_STRING,
	indexConfig: FIELD_DOCUMENT_METADATA_LANGUAGE_INDEX_CONFIG,
	inResults: true,
	key: `${FIELD_PATH_META}.language`,
	max: 1,
	min: 0
},{
	_name: `${FIELD_PATH_META_SANITIZED}.modifiedTime`, // sanitize make _ into -
	denyDelete: true,
	denyValues: true,
	fieldType: VALUE_TYPE_INSTANT,
	indexConfig: FIELD_MODIFIED_TIME_INDEX_CONFIG,
	inResults: false,
	key: `${FIELD_PATH_META}.modifiedTime`,
	max: 1,
	min: 0
},/*{
	_name: `${FIELD_PATH_META_SANITIZED}.repo`, // sanitize make _ into -
	denyDelete: true,
	denyValues: true,
	fieldType: VALUE_TYPE_SET,
	indexConfig: 'minimal',
	inResults: false,
	key: `${FIELD_PATH_META}.repo`,
	max: 1,
	min: 1
},{
	_name: `${FIELD_PATH_META_SANITIZED}.repo`, // sanitize make _ into -
	denyDelete: true,
	denyValues: true,
	fieldType: VALUE_TYPE_STRING,
	indexConfig: 'minimal',
	inResults: true,
	key: `${FIELD_PATH_META}.repo`,
	max: 1,
	min: 1
},*/{
	_name: `${FIELD_PATH_META_SANITIZED}.stemmingLanguage`, // sanitize make _ into -
	denyDelete: true,
	denyValues: true,
	fieldType: VALUE_TYPE_STRING,
	indexConfig: FIELD_DOCUMENT_METADATA_STEMMING_LANGUAGE_INDEX_CONFIG,
	inResults: true,
	key: `${FIELD_PATH_META}.stemmingLanguage`,
	max: 1,
	min: 0
},{
	_name: `${FIELD_PATH_META_SANITIZED}.valid`, // sanitize make _ into -
	denyDelete: true,
	denyValues: true,
	fieldType: VALUE_TYPE_BOOLEAN,
	indexConfig: 'minimal',
	inResults: false,
	key: `${FIELD_PATH_META}.valid`,
	max: 1,
	min: 1
}];

// READONLY_FIELDS are included in SYSTEM_FIELDS which are fields that do not exist as nodes in explorer-repo.
export const READONLY_FIELDS = [{
	_name: 'underscore-nodetype', // sanitize removes _ and makes T small
	key: '_nodeType',
	denyDelete: true,
	denyValues: false,
	fieldType: VALUE_TYPE_STRING,
	indexConfig: 'minimal',
	//inResults: false,
	max: 1,
	min: 1
}/*,{
	_name: 'underscore-score', // sanitize removes _ and makes T small
	key: '_score',
	denyDelete: true,
	denyValues: true,
	fieldType: VALUE_TYPE_DOUBLE,
	indexConfig: 'minimal',
	inResults: true,
	max: 1,
	min: 0
}*/];

// READWRITE_FIELDS are NOT included in SYSTEM_FIELDS
// READWRITE_FIELDS are created as nodes during the app-explorer/tasks/init
// READWRITE_FIELDS are included in DEFAULT_FIELDS
export const READWRITE_FIELDS = [{
	key: 'title',
	_name: 'title',
	denyDelete: true,
	denyValues: false,
	//displayName: 'Title'*/
	fieldType: VALUE_TYPE_STRING,
	indexConfig: 'fulltext', // includes nGram
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
	indexConfig: 'fulltext', // includes nGram
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
		[INDEX_CONFIG_N_GRAM]: false, // Don't need nGram for uri
		fulltext: true, // But fulltext is used by a customer
		includeInAllText: false, // Nope
		path: false
	},
	max: 1,
	min: 1
}];

// SYSTEM_FIELDS are fields that do not exist as nodes in explorer-repo.
// Used in lib-explorer/field/getFields
// Also used in app-explorer/tasks/init (they used to exist as nodes, now removed during init)
export const SYSTEM_FIELDS = NO_VALUES_FIELDS.concat(READONLY_FIELDS);

export const DEFAULT_FIELDS = NO_VALUES_FIELDS.concat(READONLY_FIELDS, READWRITE_FIELDS);

//──────────────────────────────────────────────────────────────────────────────
// Repo
//──────────────────────────────────────────────────────────────────────────────
export const REPO_JOURNALS = `${APP_EXPLORER}${DOT_SIGN}journals`;

export const COLLECTION_REPO_PREFIX = `${APP_EXPLORER}${DOT_SIGN}collection${DOT_SIGN}`;
export const RESPONSES_REPO_PREFIX = `${APP_EXPLORER}${DOT_SIGN}responses${DOT_SIGN}`;

//──────────────────────────────────────────────────────────────────────────────
// Roles
//──────────────────────────────────────────────────────────────────────────────
export const ROLE_SYSTEM_ADMIN = 'system.admin';
export const ROLE_EXPLORER_ADMIN = `${APP_EXPLORER}.admin`;

//──────────────────────────────────────────────────────────────────────────────
// Principals
//──────────────────────────────────────────────────────────────────────────────
export const PRINCIPAL_SYSTEM_ADMIN = `role:${ROLE_SYSTEM_ADMIN}`;

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
