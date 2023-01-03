import type {AccessControlEntry} from '/lib/xp/node';

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
export const Repo = {
	EXPLORER: APP_EXPLORER,
	JOURNALS: `${APP_EXPLORER}${DOT_SIGN}journals`,
} as const;

export const BRANCH_ID_EXPLORER = 'master';

export const COLLECTION_REPO_PREFIX = `${APP_EXPLORER}${DOT_SIGN}collection${DOT_SIGN}`;

//──────────────────────────────────────────────────────────────────────────────
// Folders
//──────────────────────────────────────────────────────────────────────────────
export enum Folder {
	API_KEYS = 'api-keys',
	COLLECTIONS = 'collections',
	COLLECTORS = 'collectors',
	FIELDS = 'fields',
	INTERFACES = 'interfaces',
	NOTIFICATIONS = 'notifications',
	STOPWORDS = 'stopwords',
	THESAURI = 'thesauri',
}

export const FOLDERS = [
	Folder.API_KEYS,
	Folder.COLLECTIONS,
	Folder.COLLECTORS,
	Folder.FIELDS,
	Folder.INTERFACES,
	Folder.NOTIFICATIONS,
	Folder.STOPWORDS,
	Folder.THESAURI
] as const;

//──────────────────────────────────────────────────────────────────────────────
// Node paths
//──────────────────────────────────────────────────────────────────────────────
export const Path = {
	API_KEYS: `/${Folder.API_KEYS}` as const,
	COLLECTIONS: `/${Folder.COLLECTIONS}` as const,
	COLLECTORS: `/${Folder.COLLECTORS}` as const,
	FIELDS: `/${Folder.FIELDS}` as const,
	INTERFACES: `/${Folder.INTERFACES}` as const,
} as const;

//──────────────────────────────────────────────────────────────────────────────
// Node types
//──────────────────────────────────────────────────────────────────────────────
export const NodeType = {
	API_KEY: `${APP_EXPLORER}${COLON_SIGN}api-key` as const,
	COLLECTION: `${APP_EXPLORER}${COLON_SIGN}collection` as const,
	DOCUMENT: `${APP_EXPLORER}${COLON_SIGN}document` as const,
	FIELD: `${APP_EXPLORER}${COLON_SIGN}field` as const,
	FOLDER: `${APP_EXPLORER}${COLON_SIGN}folder` as const,
	INTERFACE: `${APP_EXPLORER}${COLON_SIGN}interface` as const,
	JOURNAL: `${APP_EXPLORER}${COLON_SIGN}journal` as const,
	STOP_WORDS: `${APP_EXPLORER}${COLON_SIGN}stop-words` as const,
	SYNONYM: `${APP_EXPLORER}${COLON_SIGN}synonym` as const,
	THESAURUS: `${APP_EXPLORER}${COLON_SIGN}thesaurus` as const,
} as const;

//──────────────────────────────────────────────────────────────────────────────
// Roles
//──────────────────────────────────────────────────────────────────────────────
export const Role = {
	EXPLORER_READ: `${APP_EXPLORER}.read` as const,
	EXPLORER_WRITE: `${APP_EXPLORER}.write` as const,
	SYSTEM_ADMIN: 'system.admin' as const,
	SYSTEM_EVERYONE: 'system.everyone' as const,
} as const;

//──────────────────────────────────────────────────────────────────────────────
// Principals
//──────────────────────────────────────────────────────────────────────────────
export const Principal = {
	EXPLORER_READ: `role:${Role.EXPLORER_READ}` as const,
	EXPLORER_WRITE: `role:${Role.EXPLORER_WRITE}` as const,
	EVERYONE: `role:${Role.SYSTEM_EVERYONE}` as const,
	SYSTEM_ADMIN: `role:${Role.SYSTEM_ADMIN}` as const,
} as const;

//──────────────────────────────────────────────────────────────────────────────
// Field paths (Namespaces)
//──────────────────────────────────────────────────────────────────────────────
const FIELD_PATH_META = 'document_metadata' as const; // TODO _meta ?
export const FieldPath = {
	GLOBAL: 'global' as const, // TODO _global or _x ?
	META: 'document_metadata' as const, // TODO _meta ?
	META_COLLECTION: `${FIELD_PATH_META}.collection` as const,
	META_DOCUMENT_TYPE: `${FIELD_PATH_META}.documentType` as const,
	META_LANGUAGE: `${FIELD_PATH_META}.language` as const,
	META_STEMMING_LANGUAGE: `${FIELD_PATH_META}.stemmingLanguage` as const,
} as const;

//──────────────────────────────────────────────────────────────────────────────
// Permissions
//──────────────────────────────────────────────────────────────────────────────
export const PERMISSION_SYSTEM_ADMIN :AccessControlEntry = {
	principal: Principal.EVERYONE,
	allow: ['READ'],
	deny: []
}

export const RootPermission = {
	EXPLORER_READ: {
		principal: Principal.EXPLORER_READ,
		allow: ['READ'],
		deny: []
	} as AccessControlEntry,
	EXPLORER_WRITE: {
		principal: Principal.EXPLORER_WRITE,
		allow: [
			'READ',
			'CREATE',
			'MODIFY',
			'DELETE'
		],
		deny: []
	} as AccessControlEntry,
	SYSTEM_ADMIN: {
		principal: Principal.SYSTEM_ADMIN,
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
	} as AccessControlEntry
} as const;

export const ROOT_PERMISSIONS_EXPLORER = Object.values(RootPermission);

//──────────────────────────────────────────────────────────────────────────────
// Events
//──────────────────────────────────────────────────────────────────────────────
export const EVENT_TYPE_PREFIX_CUSTOM = 'custom'; // Move to @enonic/js-utils?
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
