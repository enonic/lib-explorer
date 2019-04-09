//──────────────────────────────────────────────────────────────────────────────
// Enonic XP libs (included in jar via gradle dependencies)
//──────────────────────────────────────────────────────────────────────────────
//import {toStr} from '/lib/enonic/util';
import {addMembers, createRole, createUser} from '/lib/xp/auth';


//──────────────────────────────────────────────────────────────────────────────
// Local libs (Absolute path without extension so it doesn't get webpacked)
//──────────────────────────────────────────────────────────────────────────────
import {
	DEFAULT_FIELDS,
	JOURNALS_REPO,
	PRINCIPAL_YASE_WRITE,
	ROLE_YASE_ADMIN,
	ROLE_YASE_READ,
	ROLE_YASE_WRITE,
	USER_YASE_JOB_RUNNER_NAME,
	USER_YASE_JOB_RUNNER_USERSTORE,
	USER_YASE_JOB_RUNNER_KEY
} from '/lib/enonic/yase/constants';
import {ignoreErrors} from '/lib/enonic/yase/ignoreErrors';
import {init as initRepo} from '/lib/enonic/yase/repo/init';
import {connect} from '/lib/enonic/yase/repo/connect';
import {create} from '/lib/enonic/yase/node/create';
import {field} from '/lib/enonic/yase/nodeTypes/field';
import {runAsSu} from '/lib/enonic/yase/runAsSu';


export function init() {
	runAsSu(() => {
		ignoreErrors(() => {
			createRole({
				name: ROLE_YASE_ADMIN,
				displayName: 'YASE Administrator',
				description: 'This role gives permissions to the YASE Admin application.'
			});
		});

		ignoreErrors(() => {
			createRole({
				name: ROLE_YASE_WRITE,
				displayName: 'YASE Repos Write Access',
				description: 'This role gives permissions to READ, CREATE, MODIFY and DELETE in repos created by the YASE Administrator app.'
			});
		});

		ignoreErrors(() => {
			createRole({
				name: ROLE_YASE_READ,
				displayName: 'YASE Repos Read Access',
				description: 'This role gives permissions to READ in repos created by the YASE Administrator app.'
			});
		});

		ignoreErrors(() => {
			createUser({
				displayName: 'YASE Job runner',
				//email: 'yase@example.com', // email is optional
				name: USER_YASE_JOB_RUNNER_NAME,
				userStore: USER_YASE_JOB_RUNNER_USERSTORE
			});
		});

		ignoreErrors(() => {
			addMembers(`role:${ROLE_YASE_WRITE}`, [USER_YASE_JOB_RUNNER_KEY]);
			addMembers(`role:${ROLE_YASE_READ}`, [USER_YASE_JOB_RUNNER_KEY]);
		});

		ignoreErrors(() => {
			initRepo();
			const connection = connect({principals:[PRINCIPAL_YASE_WRITE]});
			DEFAULT_FIELDS.forEach(({
				_name,
				displayName,
				key
			}) => {
				const params = field({
					__connection: connection,
					_name,
					displayName,
					key
				});
				//log.info(toStr({params}));
				ignoreErrors(() => {
					create(params);
				});
			})
		});

		ignoreErrors(() => {
			initRepo({
				repoId: JOURNALS_REPO
			});
		});
	});
} // function init
