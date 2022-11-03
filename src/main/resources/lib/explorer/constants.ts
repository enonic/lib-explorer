import type {
	Path
} from '/lib/explorer/types/index.d';
import type {
	PermissionsParams,
	PrincipalKeyRole
} from '/lib/explorer/types.d';

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
export const FOLDER_COLLECTIONS = 'collections';
const FOLDER_COLLECTORS = 'collectors';
const FOLDER_FIELDS = 'fields';
export const FOLDER_THESAURI = 'thesauri'

export const FOLDERS = [
	FOLDER_API_KEYS,
	FOLDER_COLLECTIONS,
	FOLDER_COLLECTORS,
	FOLDER_FIELDS,
	INTERFACES_FOLDER,
	'notifications',
	'stopwords',
	FOLDER_THESAURI
];

//──────────────────────────────────────────────────────────────────────────────
// Node paths
//──────────────────────────────────────────────────────────────────────────────
export const PATH_API_KEYS :Path = `/${FOLDER_API_KEYS}`;
export const PATH_COLLECTIONS = `/${FOLDER_COLLECTIONS}` as const;
export const PATH_COLLECTORS :Path = `/${FOLDER_COLLECTORS}`;
export const PATH_FIELDS :Path = `/${FOLDER_FIELDS}`;
export const PATH_INTERFACES :Path = `/${INTERFACES_FOLDER}`;

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
export const ROLE_SYSTEM_EVERYONE = 'system.everyone';

//──────────────────────────────────────────────────────────────────────────────
// Principals
//──────────────────────────────────────────────────────────────────────────────
export const PRINCIPAL_EXPLORER_READ :PrincipalKeyRole = `role:${ROLE_EXPLORER_READ}`;
export const PRINCIPAL_EXPLORER_WRITE :PrincipalKeyRole = `role:${ROLE_EXPLORER_WRITE}`;
export const PRINCIPAL_EVERYONE :PrincipalKeyRole = `role:${ROLE_SYSTEM_EVERYONE}`;
export const PRINCIPAL_SYSTEM_ADMIN :PrincipalKeyRole = `role:${ROLE_SYSTEM_ADMIN}`;

//──────────────────────────────────────────────────────────────────────────────
// Field paths (Namespaces)
//──────────────────────────────────────────────────────────────────────────────
export const FIELD_PATH_GLOBAL = 'global'; // TODO _global or _x ?
export const FIELD_PATH_META = 'document_metadata'; // TODO _meta ?

//──────────────────────────────────────────────────────────────────────────────
// Permissions
//──────────────────────────────────────────────────────────────────────────────
export const PERMISSION_SYSTEM_ADMIN :PermissionsParams = {
	principal: PRINCIPAL_EVERYONE,
	allow: ['READ'],
	deny: []
}

export const ROOT_PERMISSION_SYSTEM_ADMIN :PermissionsParams = {
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

export const ROOT_PERMISSION_EXPLORER_WRITE :PermissionsParams = {
	principal: PRINCIPAL_EXPLORER_WRITE,
	allow: [
		'READ',
		'CREATE',
		'MODIFY',
		'DELETE'
	],
	deny: []
};

export const ROOT_PERMISSION_EXPLORER_READ :PermissionsParams = {
	principal: PRINCIPAL_EXPLORER_READ,
	allow: ['READ'],
	deny: []
};

export const ROOT_PERMISSIONS_EXPLORER = [
	ROOT_PERMISSION_EXPLORER_READ,
	ROOT_PERMISSION_EXPLORER_WRITE,
	ROOT_PERMISSION_SYSTEM_ADMIN
];

//──────────────────────────────────────────────────────────────────────────────
// Events
//──────────────────────────────────────────────────────────────────────────────
const EVENT_TYPE_PREFIX_CUSTOM = 'custom'; // Move to @enonic/js-utils?
export const EVENT_SEND_TYPE_CUSTOM_EXPLORER_DOCUMENTTYPE_CREATED = 'explorer.documentType.created';
export const EVENT_SEND_TYPE_CUSTOM_EXPLORER_DOCUMENTTYPE_UPDATED = 'explorer.documentType.updated';

export const EVENT_LISTEN_TYPE_CUSTOM_EXPLORER_DOCUMENTTYPE_CREATED = `${EVENT_TYPE_PREFIX_CUSTOM}.${EVENT_SEND_TYPE_CUSTOM_EXPLORER_DOCUMENTTYPE_CREATED}` as const;
export const EVENT_LISTEN_TYPE_CUSTOM_EXPLORER_DOCUMENTTYPE_UPDATED = `${EVENT_TYPE_PREFIX_CUSTOM}.${EVENT_SEND_TYPE_CUSTOM_EXPLORER_DOCUMENTTYPE_UPDATED}` as const;

//──────────────────────────────────────────────────────────────────────────────
// Default values
//──────────────────────────────────────────────────────────────────────────────

// NOTE: This constant is duplicated in app-explorer/src/main/resources/assets/react/constants.ts
export const DEFAULT_INTERFACE_FIELDS = [{
	name: '_alltext',
	boost: 1
}];
