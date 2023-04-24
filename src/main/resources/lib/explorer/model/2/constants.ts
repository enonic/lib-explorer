import { Role } from '@enonic/explorer-utils';
import {
	COLON_SIGN,
	DOT_SIGN,
	HIGHLIGHT_FIELD_ALLTEXT,
	INDEX_CONFIG_N_GRAM,
	VALUE_TYPE_BOOLEAN,
	//VALUE_TYPE_DOUBLE,
	VALUE_TYPE_INSTANT,
	//VALUE_TYPE_REFERENCE,
	VALUE_TYPE_SET,
	VALUE_TYPE_STRING
} from '@enonic/js-utils';

import {
	APP_EXPLORER,
	FIELD_PATH_META
} from '/lib/explorer/constants';
export {
	APP_EXPLORER,
	BRANCH_ID_EXPLORER,
	COLLECTION_REPO_PREFIX,
	FIELD_PATH_GLOBAL,
	FIELD_PATH_META,
	FOLDERS,
	INTERFACES_FOLDER,
	NT_API_KEY,
	NT_COLLECTION,
	NT_DOCUMENT,
	NT_FIELD,
	NT_FOLDER,
	NT_INTERFACE,
	NT_JOURNAL,
	NT_STOP_WORDS,
	NT_SYNONYM,
	NT_THESAURUS,
	PATH_API_KEYS,
	PATH_COLLECTORS,
	PATH_FIELDS,
	PATH_INTERFACES,
	PRINCIPAL_EXPLORER_READ,
	PRINCIPAL_EXPLORER_WRITE,
	PRINCIPAL_SYSTEM_ADMIN,
	REPO_ID_EXPLORER,
	REPO_JOURNALS,
	ROLE_EXPLORER_READ,
	ROLE_EXPLORER_WRITE,
	ROLE_SYSTEM_ADMIN,
	ROOT_PERMISSION_SYSTEM_ADMIN,
	ROOT_PERMISSION_EXPLORER_WRITE,
	ROOT_PERMISSION_EXPLORER_READ,
	ROOT_PERMISSIONS_EXPLORER
//} from '../../constants';
} from '/lib/explorer/constants';

//──────────────────────────────────────────────────────────────────────────────
// Node types
//──────────────────────────────────────────────────────────────────────────────
export const NT_COLLECTOR = `${APP_EXPLORER}${COLON_SIGN}collector`; // TODO Remove in lib-explorer-5.0.0?
export const NT_FIELD_VALUE = `${APP_EXPLORER}${COLON_SIGN}field-value`; // TODO Remove in lib-explorer-5.0.0?
//export const NT_KEYWORD = `${APP_EXPLORER}${COLON_SIGN}keyword`;
export const NT_RESPONSE = `${APP_EXPLORER}${COLON_SIGN}response`;
//export const NT_TAG = `${APP_EXPLORER}${COLON_SIGN}tag`;

export const INDEX_CONFIG_STOP_WORDS = {default: 'byType'};

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
	key: HIGHLIGHT_FIELD_ALLTEXT,
	_name: 'alltext', // sanitize removes _ and makes T small
	//displayName: 'All text',
	fieldType: VALUE_TYPE_STRING
},{
	_name: FIELD_PATH_META_SANITIZED, // sanitize make _ into -
	fieldType: VALUE_TYPE_SET,
	indexConfig: 'minimal',
	key: FIELD_PATH_META,
	max: 1,
	min: 1
},{
	_name: `${FIELD_PATH_META_SANITIZED}.collector`, // sanitize make _ into -
	fieldType: VALUE_TYPE_SET,
	indexConfig: 'minimal',
	key: `${FIELD_PATH_META}.collector`,
	max: 1,
	min: 0
},{
	_name: `${FIELD_PATH_META_SANITIZED}.collector.id`, // sanitize make _ into -
	fieldType: VALUE_TYPE_STRING,
	indexConfig: 'minimal',
	key: `${FIELD_PATH_META}.collector.id`,
	max: 1,
	min: 0
},{
	_name: `${FIELD_PATH_META_SANITIZED}.collector.version`, // sanitize make _ into -
	fieldType: VALUE_TYPE_STRING,
	indexConfig: 'minimal',
	key: `${FIELD_PATH_META}.collector.version`,
	max: 1,
	min: 0
},/*{
	_name: `${FIELD_PATH_META_SANITIZED}.collection`, // sanitize make _ into -
	fieldType: VALUE_TYPE_SET,
	indexConfig: 'minimal',
	key: `${FIELD_PATH_META}.collection`,
	max: 1,
	min: 1
},{
	_name: `${FIELD_PATH_META_SANITIZED}.collection.id`, // sanitize make _ into -
	fieldType: VALUE_TYPE_REFERENCE,
	indexConfig: 'minimal',
	key: `${FIELD_PATH_META}.collection.id`,
	max: 1,
	min: 1
},*/{
	_name: `${FIELD_PATH_META_SANITIZED}.collection`, // sanitize make _ into -
	fieldType: VALUE_TYPE_STRING,
	indexConfig: 'minimal',
	key: `${FIELD_PATH_META}.collection`,
	max: 1,
	min: 1
},{
	_name: `${FIELD_PATH_META_SANITIZED}.createdTime`, // sanitize make _ into -
	fieldType: VALUE_TYPE_INSTANT,
	indexConfig: 'minimal',
	key: `${FIELD_PATH_META}.createdTime`,
	max: 1,
	min: 1
},/*{
	_name: `${FIELD_PATH_META_SANITIZED}.documentType`, // sanitize make _ into -
	fieldType: VALUE_TYPE_SET,
	indexConfig: 'minimal',
	key: `${FIELD_PATH_META}.documentType`,
	max: 1,
	min: 1
},{
	_name: 'document-metadata.documentType.id', // sanitize make _ into -
	fieldType: VALUE_TYPE_REFERENCE,
	indexConfig: 'minimal',
	key: `${FIELD_PATH_META}.documentType.id`,
	max: 1,
	min: 1
},*/{
	_name: 'document-metadata.documentType', // sanitize make _ into -
	fieldType: VALUE_TYPE_STRING,
	indexConfig: 'minimal',
	key: `${FIELD_PATH_META}.documentType`,
	max: 1,
	min: 1
},{
	_name: `${FIELD_PATH_META_SANITIZED}.language`, // sanitize make _ into -
	fieldType: VALUE_TYPE_STRING,
	indexConfig: FIELD_DOCUMENT_METADATA_LANGUAGE_INDEX_CONFIG,
	key: `${FIELD_PATH_META}.language`,
	max: 1,
	min: 0
},{
	_name: `${FIELD_PATH_META_SANITIZED}.modifiedTime`, // sanitize make _ into -
	fieldType: VALUE_TYPE_INSTANT,
	indexConfig: FIELD_MODIFIED_TIME_INDEX_CONFIG,
	key: `${FIELD_PATH_META}.modifiedTime`,
	max: 1,
	min: 0
},/*{
	_name: `${FIELD_PATH_META_SANITIZED}.repo`, // sanitize make _ into -
	fieldType: VALUE_TYPE_SET,
	indexConfig: 'minimal',
	key: `${FIELD_PATH_META}.repo`,
	max: 1,
	min: 1
},{
	_name: `${FIELD_PATH_META_SANITIZED}.repo`, // sanitize make _ into -
	fieldType: VALUE_TYPE_STRING,
	indexConfig: 'minimal',
	key: `${FIELD_PATH_META}.repo`,
	max: 1,
	min: 1
},*/{
	_name: `${FIELD_PATH_META_SANITIZED}.stemmingLanguage`, // sanitize make _ into -
	fieldType: VALUE_TYPE_STRING,
	indexConfig: FIELD_DOCUMENT_METADATA_STEMMING_LANGUAGE_INDEX_CONFIG,
	key: `${FIELD_PATH_META}.stemmingLanguage`,
	max: 1,
	min: 0
},{
	_name: `${FIELD_PATH_META_SANITIZED}.valid`, // sanitize make _ into -
	fieldType: VALUE_TYPE_BOOLEAN,
	indexConfig: 'minimal',
	key: `${FIELD_PATH_META}.valid`,
	max: 1,
	min: 1
}];

// READONLY_FIELDS are included in SYSTEM_FIELDS which are fields that do not exist as nodes in explorer-repo.
export const READONLY_FIELDS = [{
	_name: 'underscore-nodetype', // sanitize removes _ and makes T small
	key: '_nodeType',
	fieldType: VALUE_TYPE_STRING,
	indexConfig: 'minimal',
	max: 1,
	min: 1
}/*,{
	_name: 'underscore-score', // sanitize removes _ and makes T small
	key: '_score',
	fieldType: VALUE_TYPE_DOUBLE,
	indexConfig: 'minimal',
	max: 1,
	min: 0
}*/];

// READWRITE_FIELDS are NOT included in SYSTEM_FIELDS
// READWRITE_FIELDS are created as nodes during the app-explorer/tasks/init
// READWRITE_FIELDS are included in DEFAULT_FIELDS
export const READWRITE_FIELDS = [{
	key: 'title',
	_name: 'title',
	//displayName: 'Title'*/
	fieldType: VALUE_TYPE_STRING,
	indexConfig: 'fulltext', // includes nGram
	max: 1,
	min: 1 // TODO: There may exist pages without title, should we allow that?
},{
	key: 'language',
	_name: 'language',
	//displayName: 'Language'*/
	fieldType: VALUE_TYPE_STRING,
	indexConfig: 'type',
	max: 0,
	min: 0
},{
	key: 'text',
	_name: 'text',
	//displayName: 'Text'
	fieldType: VALUE_TYPE_STRING,
	indexConfig: 'fulltext', // includes nGram
	max: 0, // Allow array
	min: 1
},{
	key: 'uri',
	_name: 'uri',
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
export const SYSTEM_FIELDS = [].concat(
	NO_VALUES_FIELDS,
	READONLY_FIELDS
);

export const DEFAULT_FIELDS = [].concat(
	NO_VALUES_FIELDS,
	READONLY_FIELDS,
	READWRITE_FIELDS
);

//──────────────────────────────────────────────────────────────────────────────
// Repo
//──────────────────────────────────────────────────────────────────────────────
export const RESPONSES_REPO_PREFIX = `${APP_EXPLORER}${DOT_SIGN}responses${DOT_SIGN}`;

//──────────────────────────────────────────────────────────────────────────────
// Roles
//──────────────────────────────────────────────────────────────────────────────
export const ROLE_EXPLORER_ADMIN = Role.EXPLORER_ADMIN; // Deprecated use @explorer-utils

//──────────────────────────────────────────────────────────────────────────────
// User
//──────────────────────────────────────────────────────────────────────────────
export const USER_EXPLORER_APP_NAME = APP_EXPLORER;
export const USER_EXPLORER_APP_ID_PROVIDER = 'system';
export const USER_EXPLORER_APP_KEY = `user:${USER_EXPLORER_APP_ID_PROVIDER}:${USER_EXPLORER_APP_NAME}`;
