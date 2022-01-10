import type {
	PrincipalKeyRole
} from './types';


//──────────────────────────────────────────────────────────────────────────────
// Globals
//──────────────────────────────────────────────────────────────────────────────
export const APP_EXPLORER :string = 'com.enonic.app.explorer';

//──────────────────────────────────────────────────────────────────────────────
// Repo
//──────────────────────────────────────────────────────────────────────────────
export const REPO_ID_EXPLORER :string = APP_EXPLORER;
export const BRANCH_ID_EXPLORER :string = 'master';

//──────────────────────────────────────────────────────────────────────────────
// Roles
//──────────────────────────────────────────────────────────────────────────────
export const ROLE_EXPLORER_READ :string = `${APP_EXPLORER}.read`;
export const ROLE_EXPLORER_WRITE :string = `${APP_EXPLORER}.write`;

//──────────────────────────────────────────────────────────────────────────────
// Principals
//──────────────────────────────────────────────────────────────────────────────
export const PRINCIPAL_EXPLORER_READ :PrincipalKeyRole = `role:${ROLE_EXPLORER_READ}`;
export const PRINCIPAL_EXPLORER_WRITE :PrincipalKeyRole = `role:${ROLE_EXPLORER_WRITE}`;

//──────────────────────────────────────────────────────────────────────────────
// Field paths (Namespaces)
//──────────────────────────────────────────────────────────────────────────────
export const FIELD_PATH_GLOBAL :string = 'global' as const; // TODO _global or _x ?
export const FIELD_PATH_META :string = 'document_metadata' as const; // TODO _meta ?
