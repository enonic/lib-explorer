//──────────────────────────────────────────────────────────────────────────────
// Enonic XP libs (included in jar via gradle dependencies)
//──────────────────────────────────────────────────────────────────────────────
//import {toStr} from '/lib/util';
import {forceArray} from '/lib/util/data';
import {addMembers, createRole, createUser} from '/lib/xp/auth';
import {getCollectors, reschedule} from '/lib/explorer/collection/reschedule';


//──────────────────────────────────────────────────────────────────────────────
// Local libs (Absolute path without extension so it doesn't get webpacked)
//──────────────────────────────────────────────────────────────────────────────
import {
	DEFAULT_FIELDS,
	PRINCIPAL_EXPLORER_WRITE
} from '/lib/explorer/model/2/constants';

import {
	ROLES,
	USERS,
	REPOSITORIES,
	field
} from '/lib/explorer/model/2/index';

import {ignoreErrors} from '/lib/explorer/ignoreErrors';
import {init as initRepo} from '/lib/explorer/repo/init';
import {connect} from '/lib/explorer/repo/connect';
import {create} from '/lib/explorer/node/create';
import {runAsSu} from '/lib/explorer/runAsSu';
import {query} from '/lib/explorer/collection/query';
import {addFilter} from '/lib/explorer/query/addFilter';
import {hasValue} from '/lib/explorer/query/hasValue';


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

		ignoreErrors(() => {
			const connection = connect({principals:[PRINCIPAL_EXPLORER_WRITE]});
			DEFAULT_FIELDS.forEach(({
				_name,
				displayName,
				key
			}) => {
				const params = field({
					_name,
					displayName,
					key
				});
				params.__connection = connection; // eslint-disable-line no-underscore-dangle
				//log.info(toStr({params}));
				ignoreErrors(() => {
					create(params);
				});
			})

			const cron = app.config.cron === 'true';
			if (cron) {
				const collectors = getCollectors({connection});
				//log.info(toStr({collectors}));

				const collectionsRes = query({
					connection,
					filters: addFilter({
						filter: hasValue('doCollect', true)
					})
				});
				//log.info(toStr({collectionsRes})); // huge
				collectionsRes.hits.forEach(node => reschedule({
					collectors,
					node
				}))
			}
		});

	}); // runAsSu
} // function init
