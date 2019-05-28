//──────────────────────────────────────────────────────────────────────────────
// Enonic XP libs (included in jar via gradle dependencies)
//──────────────────────────────────────────────────────────────────────────────
import {getToolUrl} from '/lib/xp/admin';
import {sanitize} from '/lib/xp/common';


//──────────────────────────────────────────────────────────────────────────────
// Admin tool
//──────────────────────────────────────────────────────────────────────────────
export const PACKAGE = 'com.enonic.yase';
export const YASE_ADMIN = 'com.enonic.app.explorer';
export const TOOL_PATH = getToolUrl(YASE_ADMIN, 'explorer');


//──────────────────────────────────────────────────────────────────────────────
// Node types
//──────────────────────────────────────────────────────────────────────────────
export const NT_COLLECTION = `${PACKAGE}:collection`;
export const NT_COLLECTOR = `${PACKAGE}:collector`;
export const NT_DOCUMENT = `${PACKAGE}:document`;
export const NT_FIELD = `${PACKAGE}:field`;
export const NT_FIELD_VALUE = `${PACKAGE}:field-value`;
export const NT_FOLDER = `${PACKAGE}:folder`;
export const NT_INTERFACE = `${PACKAGE}:interface`;
export const NT_JOURNAL = `${PACKAGE}:journal`;
//export const NT_KEYWORD = `${PACKAGE}:keyword`;
export const NT_RESPONSE = `${PACKAGE}:response`;
export const NT_STOP_WORDS = `${PACKAGE}:stop-words`;
export const NT_SYNONYM = `${PACKAGE}:synonym`;
//export const NT_TAG = `${PACKAGE}:tag`;
export const NT_THESAURUS = `${PACKAGE}:thesaurus`;

//──────────────────────────────────────────────────────────────────────────────
// Various
//──────────────────────────────────────────────────────────────────────────────
export const PATH_INTERFACES = '/interfaces';


export const NO_VALUES_FIELDS = [{
	key: '_alltext',
	_name: 'alltext',
	displayName: 'All text'
}];

export const READONLY_FIELDS = [{
	key: 'type',
	_name: 'type',
	displayName: 'Type'
}];

export const READWRITE_FIELDS = [{
	key: 'title',
	_name: 'title',
	displayName: 'Title'
},{
	key: 'language',
	_name: 'language',
	displayName: 'Language'
},{
	key: 'text',
	_name: 'text',
	displayName: 'Text'
},{
	key: 'uri',
	_name: 'uri',
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
export const BRANCH_ID = 'master';
export const REPO_ID = sanitize(PACKAGE);
export const COLLECTION_REPO_PREFIX = `${PACKAGE}:collection:`;
export const RESPONSES_REPO_PREFIX = `${PACKAGE}:responses:`;
export const REPO_JOURNALS = `${PACKAGE}:journals`;


//──────────────────────────────────────────────────────────────────────────────
// Roles
//──────────────────────────────────────────────────────────────────────────────
export const ROLE_SYSTEM_ADMIN = 'system.admin';
export const ROLE_YASE_ADMIN = sanitize(`${PACKAGE}.admin`);
export const ROLE_YASE_READ = sanitize(`${PACKAGE}.read`);
export const ROLE_YASE_WRITE = sanitize(`${PACKAGE}.write`);


//──────────────────────────────────────────────────────────────────────────────
// Principals
//──────────────────────────────────────────────────────────────────────────────
export const PRINCIPAL_SYSTEM_ADMIN = `role:${ROLE_SYSTEM_ADMIN}`;
export const PRINCIPAL_YASE_READ = `role:${ROLE_YASE_READ}`;
export const PRINCIPAL_YASE_WRITE = `role:${ROLE_YASE_WRITE}`;


//──────────────────────────────────────────────────────────────────────────────
// User
//──────────────────────────────────────────────────────────────────────────────
export const USER_YASE_JOB_RUNNER_NAME = sanitize(`${PACKAGE}.job.runner`);
export const USER_YASE_JOB_RUNNER_USERSTORE = 'system';
export const USER_YASE_JOB_RUNNER_KEY = `user:${USER_YASE_JOB_RUNNER_USERSTORE}:${USER_YASE_JOB_RUNNER_NAME}`;


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

export const ROOT_PERMISSION_YASE_WRITE = {
	principal: PRINCIPAL_YASE_WRITE,
	allow: [
		'READ',
		'CREATE',
		'MODIFY',
		'DELETE'
	],
	deny: []
};

export const ROOT_PERMISSION_YASE_READ = {
	principal: PRINCIPAL_YASE_READ,
	allow: ['READ'],
	deny: []
};

export const ROOT_PERMISSIONS_YASE = [
	ROOT_PERMISSION_SYSTEM_ADMIN,
	ROOT_PERMISSION_YASE_WRITE,
	ROOT_PERMISSION_YASE_READ
];
