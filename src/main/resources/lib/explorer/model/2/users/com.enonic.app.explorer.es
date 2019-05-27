import {
	ROLE_EXPLORER_READ,
	ROLE_EXPLORER_WRITE,
	USER_EXPLORER_APP_NAME,
	USER_EXPLORER_APP_USERSTORE
} from '../constants.es';


export const USER = {
	displayName: 'Explorer App User',
	name: USER_EXPLORER_APP_NAME,
	userStore: USER_EXPLORER_APP_USERSTORE,
	roles: [
		ROLE_EXPLORER_READ,
		ROLE_EXPLORER_WRITE
	]
};
