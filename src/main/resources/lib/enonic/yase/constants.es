//──────────────────────────────────────────────────────────────────────────────
// Enonic XP libs (included in jar via gradle dependencies)
//──────────────────────────────────────────────────────────────────────────────
import {getToolUrl} from '/lib/xp/admin';
import {sanitize} from '/lib/xp/common';


//──────────────────────────────────────────────────────────────────────────────
// Admin tool
//──────────────────────────────────────────────────────────────────────────────
export const PACKAGE = 'com.enonic.yase';
export const YASE_ADMIN = 'com.enonic.app.yase';
export const APP_SURGEON = `${PACKAGE}.surgeon`;
export const TOOL_PATH = getToolUrl(YASE_ADMIN, 'yase');


//──────────────────────────────────────────────────────────────────────────────
// Node types
//──────────────────────────────────────────────────────────────────────────────
export const NT_COLLECTION = `${PACKAGE}:collection`;
export const NT_DOCUMENT = `${PACKAGE}:document`;
export const NT_FIELD = `${PACKAGE}:field`;
export const NT_FIELD_VALUE = `${PACKAGE}:field-value`;
export const NT_FOLDER = `${PACKAGE}:folder`;
export const NT_INTERFACE = `${PACKAGE}:interface`;
export const NT_RESPONSE = `${PACKAGE}:response`;
export const NT_SYNONYM = `${PACKAGE}:synonym`;
export const NT_TAG = `${PACKAGE}:tag`;
export const NT_THESAURUS = `${PACKAGE}:thesaurus`;

//──────────────────────────────────────────────────────────────────────────────
// Node paths
//──────────────────────────────────────────────────────────────────────────────
export const PATH_INTERFACES = '/interfaces';
export const PATH_TAG = '/tags';


export const TASK_COLLECT = `${YASE_ADMIN}:collect`;


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


//──────────────────────────────────────────────────────────────────────────────
// Roles
//──────────────────────────────────────────────────────────────────────────────
export const ROLE_YASE_ADMIN = sanitize(`${PACKAGE}.admin`);
export const ROLE_YASE_READ = sanitize(`${PACKAGE}.read`);
export const ROLE_YASE_WRITE = sanitize(`${PACKAGE}.write`);


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
	principal: 'role:system.admin',
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
	principal: `role:${ROLE_YASE_WRITE}`,
	allow: [
		'READ',
		'CREATE',
		'MODIFY',
		'DELETE'
	],
	deny: []
};

export const ROOT_PERMISSION_YASE_READ = {
	principal: `role:${ROLE_YASE_READ}`,
	allow: ['READ'],
	deny: []
};

export const ROOT_PERMISSIONS_YASE = [
	ROOT_PERMISSION_SYSTEM_ADMIN,
	ROOT_PERMISSION_YASE_WRITE,
	ROOT_PERMISSION_YASE_READ
];
