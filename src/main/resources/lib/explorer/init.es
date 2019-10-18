//──────────────────────────────────────────────────────────────────────────────
// Enonic XP libs (included in jar via gradle dependencies)
//──────────────────────────────────────────────────────────────────────────────
//import {get as getJob, list as listJobs} from '/lib/cron';
import {toStr} from '/lib/util';
import {forceArray} from '/lib/util/data';
import {addMembers, createRole, createUser} from '/lib/xp/auth';
import {getCollectors, reschedule} from '/lib/explorer/collection/reschedule';

//──────────────────────────────────────────────────────────────────────────────
// Local libs (Absolute path without extension so it doesn't get webpacked)
//──────────────────────────────────────────────────────────────────────────────
import {
	DEFAULT_FIELDS,
	NT_DOCUMENT,
	PRINCIPAL_EXPLORER_WRITE,
	ROOT_PERMISSION_SYSTEM_ADMIN,
	ROOT_PERMISSION_EXPLORER_READ
} from '/lib/explorer/model/2/constants';

import {
	DEFAULT_INTERFACE,
	ROLES,
	REPOSITORIES,
	USERS,
	field,
	fieldValue,
	interfaceModel
} from '/lib/explorer/model/2/index';

import {ignoreErrors} from '/lib/explorer/ignoreErrors';
import {logErrors} from '/lib/explorer/logErrors';
import {init as initRepo} from '/lib/explorer/repo/init';
import {connect} from '/lib/explorer/repo/connect';
import {getField} from '/lib/explorer/field/getField';
import {create} from '/lib/explorer/node/create';
import {runAsSu} from '/lib/explorer/runAsSu';
import {query} from '/lib/explorer/collection/query';
import {addFilter} from '/lib/explorer/query/addFilter';
import {hasValue} from '/lib/explorer/query/hasValue';
//import {migrate} from '/lib/explorer/migrations/2/index';


export function init() {
	runAsSu(() => {
		ROLES.forEach(({name, displayName, description}) => ignoreErrors(() => {
			createRole({
				name,
				displayName,
				description
			});
		}));

		//log.info(toStr({USERS}));
		USERS.forEach(({name, displayName, idProvider, roles = []}) => ignoreErrors(() => {
			createUser({
				idProvider,
				name,
				displayName
			});
			roles.forEach(role => addMembers(`role:${role}`, [`user:${idProvider}:${name}`]));
		}));

		REPOSITORIES.forEach(({id, rootPermissions}) => ignoreErrors(() => {
			initRepo({
				repoId: id,
				rootPermissions
			});
		}));

		const connection = connect({principals:[PRINCIPAL_EXPLORER_WRITE]});
		DEFAULT_FIELDS.forEach(({
			_name,
			denyDelete,
			denyValues,
			displayName,
			key,
			inResults = true
		}) => {
			const params = field({
				_name,
				_inheritsPermissions: false,
				_permissions: [
					ROOT_PERMISSION_SYSTEM_ADMIN,
					ROOT_PERMISSION_EXPLORER_READ
				],
				denyDelete,
				denyValues,
				displayName,
				key,
				inResults
			});
			params.__connection = connection; // eslint-disable-line no-underscore-dangle
			//log.info(toStr({params}));
			ignoreErrors(() => {
				const node = create(params);
			});
		})

		const node = getField({
			connection,
			_name: 'type'
		});
		//log.info(`node:${toStr({node})}`);
		if (node) {
			const paramsV = fieldValue({
				displayName: 'Document',
				field: 'type',
				fieldReference: node._id,
				value: NT_DOCUMENT
			});
			//log.info(`paramsV:${toStr({paramsV})}`);
			paramsV.__connection = connection; // eslint-disable-line no-underscore-dangle
			logErrors(() => {
				create(paramsV);
			});
		} else {
			log.error(`Field type not found! Cannot create field value ${NT_DOCUMENT}`);
		}

		const paramsI = interfaceModel(DEFAULT_INTERFACE);
		paramsI.__connection = connection; // eslint-disable-line no-underscore-dangle
		ignoreErrors(() => {
			create(paramsI);
		});

	}); // runAsSu
	//migrate();
} // function init
