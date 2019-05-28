import {
	ROLE_EXPLORER_READ,
	ROLE_EXPLORER_WRITE,
	USER_EXPLORER_APP_NAME,
	USER_EXPLORER_APP_ID_PROVIDER
} from '/lib/explorer/model/2/constants';


export const USER = {
	displayName: 'Explorer App User',
	name: USER_EXPLORER_APP_NAME,
	idProvider: USER_EXPLORER_APP_ID_PROVIDER,
	roles: [
		ROLE_EXPLORER_READ,
		ROLE_EXPLORER_WRITE
	]
};
