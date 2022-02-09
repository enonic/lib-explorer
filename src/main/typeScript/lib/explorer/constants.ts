import type {PrincipalKeyRole} from '@enonic/js-utils/src/mock/auth/';

import {
	COLON_SIGN,
	DOT_SIGN
} from '@enonic/js-utils';

//──────────────────────────────────────────────────────────────────────────────
// Globals
//──────────────────────────────────────────────────────────────────────────────
export const APP_EXPLORER = 'com.enonic.app.explorer';

//──────────────────────────────────────────────────────────────────────────────
// Repo
//──────────────────────────────────────────────────────────────────────────────
export const REPO_ID_EXPLORER = APP_EXPLORER;
export const REPO_JOURNALS = `${APP_EXPLORER}${DOT_SIGN}journals`;

export const BRANCH_ID_EXPLORER = 'master';

export const COLLECTION_REPO_PREFIX = `${APP_EXPLORER}${DOT_SIGN}collection${DOT_SIGN}`;

//──────────────────────────────────────────────────────────────────────────────
// Folders
//──────────────────────────────────────────────────────────────────────────────
export const INTERFACES_FOLDER = 'interfaces';
const FOLDER_API_KEYS = 'api-keys';
const FOLDER_COLLECTIONS = 'collections';
const FOLDER_COLLECTORS = 'collectors';
const FOLDER_FIELDS = 'fields';

export const FOLDERS = [
	FOLDER_API_KEYS,
	FOLDER_COLLECTIONS,
	FOLDER_COLLECTORS,
	FOLDER_FIELDS,
	INTERFACES_FOLDER,
	'notifications',
	'stopwords',
	'thesauri'
];

//──────────────────────────────────────────────────────────────────────────────
// Node paths
//──────────────────────────────────────────────────────────────────────────────
export const PATH_API_KEYS = `/${FOLDER_API_KEYS}`;
export const PATH_COLLECTIONS = `/${FOLDER_COLLECTIONS}`;
export const PATH_COLLECTORS = `/${FOLDER_COLLECTORS}`;
export const PATH_FIELDS = `/${FOLDER_FIELDS}`;
export const PATH_INTERFACES = `/${INTERFACES_FOLDER}`;

//──────────────────────────────────────────────────────────────────────────────
// Node types
//──────────────────────────────────────────────────────────────────────────────
export const NT_API_KEY = `${APP_EXPLORER}${COLON_SIGN}api-key`;
export const NT_COLLECTION = `${APP_EXPLORER}${COLON_SIGN}collection`;
export const NT_DOCUMENT = `${APP_EXPLORER}${COLON_SIGN}document`;
export const NT_FIELD = `${APP_EXPLORER}${COLON_SIGN}field`;
export const NT_FOLDER = `${APP_EXPLORER}${COLON_SIGN}folder`;
export const NT_INTERFACE = `${APP_EXPLORER}${COLON_SIGN}interface`;
export const NT_JOURNAL = `${APP_EXPLORER}${COLON_SIGN}journal`;
export const NT_STOP_WORDS = `${APP_EXPLORER}${COLON_SIGN}stop-words`;
export const NT_SYNONYM = `${APP_EXPLORER}${COLON_SIGN}synonym`;
export const NT_THESAURUS = `${APP_EXPLORER}${COLON_SIGN}thesaurus`;

//──────────────────────────────────────────────────────────────────────────────
// Roles
//──────────────────────────────────────────────────────────────────────────────
export const ROLE_EXPLORER_READ = `${APP_EXPLORER}.read`;
export const ROLE_EXPLORER_WRITE = `${APP_EXPLORER}.write`;
export const ROLE_SYSTEM_ADMIN = 'system.admin';

//──────────────────────────────────────────────────────────────────────────────
// Principals
//──────────────────────────────────────────────────────────────────────────────
export const PRINCIPAL_EXPLORER_READ :PrincipalKeyRole = `role:${ROLE_EXPLORER_READ}`;
export const PRINCIPAL_EXPLORER_WRITE :PrincipalKeyRole = `role:${ROLE_EXPLORER_WRITE}`;
export const PRINCIPAL_SYSTEM_ADMIN = `role:${ROLE_SYSTEM_ADMIN}`;

//──────────────────────────────────────────────────────────────────────────────
// Field paths (Namespaces)
//──────────────────────────────────────────────────────────────────────────────
export const FIELD_PATH_GLOBAL = 'global'; // TODO _global or _x ?
export const FIELD_PATH_META = 'document_metadata'; // TODO _meta ?

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
