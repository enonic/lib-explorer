//──────────────────────────────────────────────────────────────────────────────
// Enonic XP libs (included in jar via gradle dependencies)
//──────────────────────────────────────────────────────────────────────────────
import {toStr} from '/lib/enonic/util';
import {forceArray} from '/lib/enonic/util/data';
import {addMembers, createRole, createUser} from '/lib/xp/auth';
import {run} from '/lib/xp/context';
import {submitNamed} from '/lib/xp/task';
import {schedule, unschedule} from '/lib/cron';


//──────────────────────────────────────────────────────────────────────────────
// Local libs (Absolute path without extension so it doesn't get webpacked)
//──────────────────────────────────────────────────────────────────────────────
import {
	DEFAULT_FIELDS,
	JOURNALS_REPO,
	PRINCIPAL_SYSTEM_ADMIN,
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
import {query} from '/lib/enonic/yase/collection/query';
import {query as queryCollectors} from '/lib/enonic/yase/collector/query';
import {addFilter} from '/lib/enonic/yase/query/addFilter';
import {hasValue} from '/lib/enonic/yase/query/hasValue';


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

			const collectors = {};
			queryCollectors({
				connection
			}).hits.forEach(({_name: application, collectTaskName}) => {
				collectors[application] = collectTaskName;
			});

			const collectionsRes = query({
				connection,
				filters: addFilter({
					filter: hasValue('doCollect', true)
				})
			});

			//
			//log.info(toStr({collectionsRes}));
			collectionsRes.hits.forEach(({
				_id: id,
				_name: collectionName,
				collector: {
					name: collectorName,
					config: collectorConfig
				} = {},
				cron: cronArray,
				displayName: collectionDisplayName,
				doCollect = false
			}) => {
				if (doCollect) {
					if (!collectorName) {
						log.warning(`Collection ${collectionDisplayName} is missing a collector!`);
					} else {
						if(!collectors[collectorName]) {
							log.error(`Collection ${collectionDisplayName} is using a non-existant collector ${collectorName}!`);
						} else {
							const taskName = `${collectorName}:${collectors[collectorName]}`;
							//log.info(toStr({cronArray}));

							const configJson = JSON.stringify(collectorConfig);
							//log.info(toStr({configJson}));

							const taskParams = {
								name: taskName,
								config: {
									name: collectionName,
									configJson
								}
							};
							//log.info(toStr({taskParams}));

							//log.info(toStr({cronArray}));
							forceArray(cronArray).forEach(({minute, hour, dayOfMonth, month, dayOfWeek}, i) => {
								const cron = `${minute} ${hour} ${dayOfMonth} ${month} ${dayOfWeek}`;
								//log.info(toStr({cron}));
								schedule({
									name: `${id}:${i}`,
									cron,
									callback: () => run({
										branch: 'master', // Repository to execute the callback in.
										repository: 'system-repo', // Name of the branch to execute the callback in.
										user: { // User to execute the callback with.
											login: USER_YASE_JOB_RUNNER_NAME,
											userStore: USER_YASE_JOB_RUNNER_USERSTORE
										},
										principals: [ // // Additional principals to execute the callback with.
											PRINCIPAL_SYSTEM_ADMIN, // Needed for creating repos.
											PRINCIPAL_YASE_WRITE
										]
									}, () => submitNamed(taskParams))
								})
							});
						}
					}
				}
			})
		});

		ignoreErrors(() => {
			initRepo({
				repoId: JOURNALS_REPO
			});
		});
	}); // runAsSu
} // function init
