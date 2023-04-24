import {
	FieldPath,
	Folder,
	NodeType,
	Path,
	Principal,
	Repo,
	Role,
	RootPermission
} from '@enonic/explorer-utils';

export {
	APP_EXPLORER,
	BRANCH_ID_EXPLORER,
	COLLECTION_REPO_PREFIX,
	EVENT_TYPE_PREFIX_CUSTOM,
	EVENT_SEND_TYPE_CUSTOM_EXPLORER_DOCUMENTTYPE_CREATED,
	EVENT_SEND_TYPE_CUSTOM_EXPLORER_DOCUMENTTYPE_UPDATED,
	EVENT_LISTEN_TYPE_CUSTOM_EXPLORER_DOCUMENTTYPE_CREATED,
	EVENT_LISTEN_TYPE_CUSTOM_EXPLORER_DOCUMENTTYPE_UPDATED,
	FOLDERS,
	PERMISSION_SYSTEM_ADMIN,
	ROOT_PERMISSIONS_EXPLORER,
} from '@enonic/explorer-utils';


//──────────────────────────────────────────────────────────────────────────────
// Backwards compatibility
//──────────────────────────────────────────────────────────────────────────────
export const FIELD_PATH_GLOBAL = FieldPath.GLOBAL;
export const FIELD_PATH_META = FieldPath.META;
export const FIELD_PATH_META_COLLECTION = FieldPath.META_COLLECTION;
export const FIELD_PATH_META_DOCUMENT_TYPE = FieldPath.META_DOCUMENT_TYPE;
export const FIELD_PATH_META_LANGUAGE = FieldPath.META_LANGUAGE;
export const FIELD_PATH_META_STEMMING_LANGUAGE = FieldPath.META_STEMMING_LANGUAGE;

export const FOLDER_API_KEYS = Folder.API_KEYS;
export const FOLDER_COLLECTIONS = Folder.COLLECTIONS;
export const FOLDER_COLLECTORS = Folder.COLLECTORS;
export const FOLDER_FIELDS = Folder.FIELDS;
export const FOLDER_INTERFACES = Folder.INTERFACES;
export const FOLDER_NOTIFICATIONS = Folder.NOTIFICATIONS;
export const FOLDER_STOPWORDS = Folder.STOPWORDS;
export const FOLDER_THESAURI = Folder.THESAURI;

export const INTERFACES_FOLDER = Folder.INTERFACES;

export const NT_API_KEY = NodeType.API_KEY;
export const NT_COLLECTION = NodeType.COLLECTION;
export const NT_DOCUMENT = NodeType.DOCUMENT;
export const NT_FIELD = NodeType.FIELD;
export const NT_FOLDER = NodeType.FOLDER;
export const NT_INTERFACE = NodeType.INTERFACE;
export const NT_JOURNAL = NodeType.JOURNAL;
export const NT_STOP_WORDS = NodeType.STOP_WORDS;
export const NT_SYNONYM = NodeType.SYNONYM;
export const NT_THESAURUS = NodeType.THESAURUS;

export const PATH_API_KEYS = Path.API_KEYS;
export const PATH_COLLECTIONS = Path.COLLECTIONS;
export const PATH_COLLECTORS = Path.COLLECTORS;
export const PATH_FIELDS = Path.FIELDS;
export const PATH_INTERFACES = Path.INTERFACES;

export const PRINCIPAL_EVERYONE = Principal.EVERYONE;
export const PRINCIPAL_EXPLORER_READ = Principal.EXPLORER_READ;
export const PRINCIPAL_EXPLORER_WRITE = Principal.EXPLORER_WRITE;
export const PRINCIPAL_SYSTEM_ADMIN = Principal.SYSTEM_ADMIN;

export const REPO_ID_EXPLORER = Repo.EXPLORER;
export const REPO_JOURNALS = Repo.JOURNALS;

export const ROLE_EXPLORER_READ = Role.EXPLORER_READ;
export const ROLE_EXPLORER_WRITE = Role.EXPLORER_WRITE;
export const ROLE_SYSTEM_ADMIN = Role.SYSTEM_ADMIN;
export const ROLE_SYSTEM_EVERYONE = Role.SYSTEM_EVERYONE;

export const ROOT_PERMISSION_SYSTEM_ADMIN = RootPermission.SYSTEM_ADMIN;
export const ROOT_PERMISSION_EXPLORER_READ = RootPermission.EXPLORER_READ;
export const ROOT_PERMISSION_EXPLORER_WRITE = RootPermission.EXPLORER_WRITE;

//──────────────────────────────────────────────────────────────────────────────
// Default values
//──────────────────────────────────────────────────────────────────────────────
// NOTE: This constant is duplicated in app-explorer/src/main/resources/assets/react/constants.ts
// TODO: I don't even think this is in use anymore
export const DEFAULT_INTERFACE_FIELDS = [{
	name: '_alltext',
	boost: 1
}];
