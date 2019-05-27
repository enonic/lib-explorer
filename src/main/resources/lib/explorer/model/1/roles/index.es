// Recogniced by webpack as local libraries, resolved buildtime and bundeled
//import {ROLE as ROLE_ADMIN} from './com.enonic.yase.admin';
//import {ROLE as ROLE_READ} from './com.enonic.yase.read';
//import {ROLE as ROLE_WRITE} from './com.enonic.yase.write';

// Recogniced by webpack as external libraries, resolved runtime
import {ROLE as ROLE_ADMIN} from '/lib/explorer/model/1/roles/com.enonic.yase.admin';
import {ROLE as ROLE_READ} from '/lib/explorer/model/1/roles/com.enonic.yase.read';
import {ROLE as ROLE_WRITE} from '/lib/explorer/model/1/roles/com.enonic.yase.write';



export const ROLES = [
	ROLE_ADMIN,
	ROLE_READ,
	ROLE_WRITE
];
