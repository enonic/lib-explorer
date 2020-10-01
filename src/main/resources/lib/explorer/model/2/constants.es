//──────────────────────────────────────────────────────────────────────────────
// Enonic XP libs (included in jar via gradle dependencies)
//──────────────────────────────────────────────────────────────────────────────
import {getToolUrl} from '/lib/xp/admin';
import {sanitize} from '/lib/xp/common';


//──────────────────────────────────────────────────────────────────────────────
// Admin tool
//──────────────────────────────────────────────────────────────────────────────
export const APP_EXPLORER = 'com.enonic.app.explorer';
export const TOOL_PATH = getToolUrl(APP_EXPLORER, 'explorer');

export const COLON_SIGN = ':'; // Not good in repo names
//export const RATIO_SIGN = '∶'; // Not good in repo names
export const DOT_SIGN = '.';
export const ELLIPSIS = '…';
//──────────────────────────────────────────────────────────────────────────────
// Node types
//──────────────────────────────────────────────────────────────────────────────
export const NT_COLLECTION = `${APP_EXPLORER}${COLON_SIGN}collection`;
export const NT_COLLECTOR = `${APP_EXPLORER}${COLON_SIGN}collector`;
export const NT_DOCUMENT = `${APP_EXPLORER}${COLON_SIGN}document`;
export const NT_FIELD = `${APP_EXPLORER}${COLON_SIGN}field`;
export const NT_FIELD_VALUE = `${APP_EXPLORER}${COLON_SIGN}field-value`;
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
export const PATH_COLLECTORS = '/collectors';
export const PATH_INTERFACES = '/interfaces';


export const NO_VALUES_FIELDS = [{
	key: '_allText',
	_name: '_allText', // sanitize removes _ and makes T small
	denyDelete: true,
	denyValues: true,
	displayName: 'All text',
	inResults: false
}];

export const READONLY_FIELDS = [{
	key: 'type',
	_name: 'type',
	denyDelete: true,
	denyValues: false,
	displayName: 'Type'/*,
	readonly: true*/
}];

export const READWRITE_FIELDS = [{
	key: 'title',
	_name: 'title',
	denyDelete: true,
	denyValues: false,
	displayName: 'Title'
},{
	key: 'language',
	_name: 'language',
	denyDelete: true,
	denyValues: false,
	displayName: 'Language'
},{
	key: 'text',
	_name: 'text',
	denyDelete: true,
	denyValues: false,
	displayName: 'Text'
},{
	key: 'uri',
	_name: 'uri',
	denyDelete: true,
	denyValues: false,
	displayName: 'Uri'
}];

export const DEFAULT_FIELDS = NO_VALUES_FIELDS.concat(READONLY_FIELDS, READWRITE_FIELDS);


//──────────────────────────────────────────────────────────────────────────────
// Return types
//──────────────────────────────────────────────────────────────────────────────
export const RT_JSON = 'text/json;charset=utf-8';
export const RT_HTML = 'text/html;charset=utf-8';


//──────────────────────────────────────────────────────────────────────────────
// Repo
//──────────────────────────────────────────────────────────────────────────────

export const REPO_ID_EXPLORER = sanitize(APP_EXPLORER);
export const BRANCH_ID_EXPLORER = 'master';
export const REPO_JOURNALS = `${APP_EXPLORER}${DOT_SIGN}journals`;

export const COLLECTION_REPO_PREFIX = `${APP_EXPLORER}${DOT_SIGN}collection${DOT_SIGN}`;
export const RESPONSES_REPO_PREFIX = `${APP_EXPLORER}${DOT_SIGN}responses${DOT_SIGN}`;


//──────────────────────────────────────────────────────────────────────────────
// Roles
//──────────────────────────────────────────────────────────────────────────────
export const ROLE_SYSTEM_ADMIN = 'system.admin';
export const ROLE_EXPLORER_ADMIN = sanitize(`${APP_EXPLORER}.admin`);
export const ROLE_EXPLORER_READ = sanitize(`${APP_EXPLORER}.read`);
export const ROLE_EXPLORER_WRITE = sanitize(`${APP_EXPLORER}.write`);


//──────────────────────────────────────────────────────────────────────────────
// Principals
//──────────────────────────────────────────────────────────────────────────────
export const PRINCIPAL_SYSTEM_ADMIN = `role:${ROLE_SYSTEM_ADMIN}`;
export const PRINCIPAL_EXPLORER_READ = `role:${ROLE_EXPLORER_READ}`;
export const PRINCIPAL_EXPLORER_WRITE = `role:${ROLE_EXPLORER_WRITE}`;


//──────────────────────────────────────────────────────────────────────────────
// User
//──────────────────────────────────────────────────────────────────────────────
export const USER_EXPLORER_APP_NAME = sanitize(`${APP_EXPLORER}`);
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
export const EVENT_COLLECTOR_UNREGISTER = `${APP_EXPLORER}.collector.unregister`;
