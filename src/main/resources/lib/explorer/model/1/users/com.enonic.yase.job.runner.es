import {
	ROLE_YASE_READ,
	ROLE_YASE_WRITE
} from '/lib/explorer/model/1/constants';


export const USER = {
	displayName: 'YASE Job runner',
	name: 'com.enonic.yase.job.runner',
	userStore: 'system',
	roles: [
		ROLE_YASE_READ,
		ROLE_YASE_WRITE
	]
};
