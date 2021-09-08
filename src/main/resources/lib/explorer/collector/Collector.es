import {isNotSet, toStr} from '@enonic/js-utils';

//import {validateLicense} from '/lib/license';

import {send} from '/lib/xp/mail';

import {
	//APP_EXPLORER,
	NT_DOCUMENT,
	PRINCIPAL_EXPLORER_READ
} from '/lib/explorer/model/2/constants';

import {createOrUpdate} from '/lib/explorer/document/createOrUpdate';
import {get as getNode} from '/lib/explorer/node/get';
import {connect} from '/lib/explorer/repo/connect';
import {progress} from '/lib/explorer/task/progress';
import {get as getTask} from '/lib/explorer/task/get';
import {hash} from '/lib/explorer/string/hash';
import {modify as modifyTask} from '/lib/explorer/task/modify';
//import {javaLocaleToSupportedLanguage} from '/lib/explorer/stemming/javaLocaleToSupportedLanguage';
//import {Document} from '/lib/explorer/model/2/nodeTypes/document';

//import {getTotalCount} from '/lib/explorer/collection/getTotalCount';

import {Collection} from '/lib/explorer/collector/Collection';
import {Journal} from '/lib/explorer/collector/Journal';


const {currentTimeMillis} = Java.type('java.lang.System');


export class Collector {
	#language;

	constructor({name, collectorId, configJson, language}) {
		//log.info(toStr({name, collectorId, configJson}));

		if (!name) { throw new Error('Missing required parameter name!'); }
		this.name = name;
		if (!collectorId) { throw new Error('Missing required parameter collectorId!'); }
		this.collectorId = collectorId;
		if (!configJson) { throw new Error('Missing required parameter configJson!'); }

		if (language) {
			//this.#language = javaLocaleToSupportedLanguage(language);
			this.#language = language; // Reducing to stemmingLanguage happens inside create and update
		}

		/*const explorerRepoReadConnection = connect({
			principals: [PRINCIPAL_EXPLORER_READ]
		});
		const collectionsTotalCount = getTotalCount({ connection: explorerRepoReadConnection });
		//log.info(`collectionsTotalCount:${collectionsTotalCount}`);

        // WARNING https://github.com/enonic/lib-license/issues/21
		const licenseDetails = validateLicense({appKey: APP_EXPLORER});
		if (collectionsTotalCount > 3) {
			if (!licenseDetails) {
				const errorMsg = 'No license found! Not allowed to have more than 3 collections without a valid license.'
				log.error(errorMsg);
				throw new Error(errorMsg);
			}
			if (licenseDetails.expired) {
				const errorMsg = 'License expired! Not allowed to have more than 3 collections without a valid license.'
				log.error(errorMsg);
				throw new Error(errorMsg);
			}
		}*/

		try {
			this.config = JSON.parse(configJson); //log.info(toStr({config}));
		} catch (e) {
			throw new Error(`${name}: JSON.parse(configJson) failed!`);
		}
	} // constructor


	progress() {
		progress(this.taskProgressObj);
	}


	start() {
		this.startTime = currentTimeMillis();
		this.taskProgressObj = {
			current: 0,
			total: 1, // Or it will appear as there is nothing to do.
			info: {
				name: this.name,
				message: 'Initializing...',
				startTime: this.startTime
			}
		};
		this.progress();
		this.collection = new Collection({name: this.name});
		modifyTask({
			connection: this.collection.connection,
			state: 'RUNNING',
			should: 'RUN'
		});
		this.journal = new Journal({name: this.name, startTime: this.startTime});
	} // start


	shouldStop() {
		const task = getTask({connection: this.collection.connection}); //log.info(toStr({task}));
		const {should} = task;
		if (should === 'STOP') {
			log.warning(`Got message to stop task: ${toStr(this.taskProgressObj)}`);
			return true;
		}
		return false;
	} // shouldStop


	persistDocument({
		_parentPath = '/',
		document_metadata: {
			...document_metadata_props
		} = {},
		uri,
		_name = hash(uri),
		...rest // Slurps properties
	}, {
		boolRequireValid,
		...ignoredOptions
	} = {}) {
		//log.debug(`document_metadata_props:${toStr(document_metadata_props)}`);
		//log.debug(`rest:${toStr(rest)}`);
		//log.debug(`ignoredOptions:${toStr(ignoredOptions)}`);

		Object.keys(rest).forEach((k) => {
			if (k.startsWith('__')) {
				log.warning(`Deprecation: Function signature changed. Added second argument for options.
			Old: collector.persistDocument({${k}, ...})
			New: collector.persistDocument({...}, {${k.substring(2)}})`);
				if(k === '__boolRequireValid') {
					if (isNotSet(boolRequireValid)) {
						boolRequireValid = rest[k];
					}
				} else {
					log.warning(`collector.persistDocument: Ignored option:${k} value:${toStr(rest[k])}`);
				}
				delete rest[k];
			}
		});

		if (isNotSet(boolRequireValid)) {
			boolRequireValid = false;
		}

		if (Object.keys(ignoredOptions).length) {
			log.warning(`collector.persistDocument: Ignored options:${toStr(ignoredOptions)}`);
		}

		// Even when boolRequireValid is false, we still require uri for Collectors,
		// or they can't find _id from _name when updating
		if (!uri) { throw new Error('persistDocument: Missing required parameter uri!'); }

		const documentToPersist = {
			...rest,

			// TODO? lib-explorer-4.0.0 Allow advanced collectors to pass their own.
			//_indexConfig, // Built automatically

			_name,
			_nodeType: NT_DOCUMENT,
			_parentPath,
			document_metadata: {
				...document_metadata_props, // might contain language
				collector: {
					//appName: app.name,
					id: this.collectorId, // This contains both appName and taskName
					version: app.version
				}
			},
			uri
		};
		//log.debug(`documentToPersist:${toStr(documentToPersist)}`);

		const path = `${_parentPath}${_name}`;
		//log.debug(`path:${path}`);

		const existingNode = this.collection.connection.get(path);
		//log.debug(`existingNode:${toStr(existingNode)}`);

		if (existingNode) {
			documentToPersist._id = existingNode._id;
		}
		//log.debug(`documentToPersist:${toStr(documentToPersist)}`);

		const persistedNode = createOrUpdate(documentToPersist, {
			boolRequireValid,
			connection: this.collection.connection,
			language: this.#language
		});
		if (!persistedNode) {
			throw new Error('Something went wrong when trying to persist a document!');
		}
		//log.debug(`persistedNode:${toStr(persistedNode)}`);
		return persistedNode;
	} // persistDocument


	addError(...params) {
		this.journal.addError(...params);
	}


	addSuccess(...params) {
		this.journal.addSuccess(...params);
	}


	stop() {
		this.journal.create();
		this.taskProgressObj.current = this.taskProgressObj.total; // Make sure it ends at 100%
		this.taskProgressObj.info.message = `Finished with ${this.journal.errors.length} errors.`;
		this.progress(); // This also implicitly sets final currentTime and duration

		const node = getNode({
			connection: connect({
				principals: [PRINCIPAL_EXPLORER_READ]
			}),
			path: '/notifications'
		}) || {};
		//log.info(`node:${toStr(node)}`);

		const {emails = []} = node;
		//log.info(`emails:${toStr(emails)}`);

		if (this.journal.errors.length) {
			log.error(toStr({failedUris: this.journal.errors}));
			modifyTask({
				connection: this.collection.connection,
				state: 'FAILED',
				should: 'STOP'
			});

			// Error Notifications
			if (emails.length) {
				try {
					const emailParams = {
						from: 'explorer-noreply@enonic.com',
						to: emails,
						subject: `Collecting to ${this.name} had ${this.journal.errors.length} errors!`,
						body: `${toStr(this.journal.errors)}`
					};
					log.info(`emailParams:${toStr(emailParams)}`);
					send(emailParams);
				} catch (e) {
					log.error(e.message, e);
				}
			}

			throw new Error(JSON.stringify(this.taskProgressObj.info)); // Throw so task state becomes FAILED.
			//throw new Error(this.taskProgressObj.info.message); // Throw so task state becomes FAILED.
		}
		modifyTask({
			connection: this.collection.connection,
			state: 'FINISHED',
			should: 'STOP'
		});

		// Success Notifications
		if (emails.length) {
			try {
				const emailParams = {
					from: 'explorer-noreply@enonic.com',
					to: emails,
					subject: `Collecting to ${this.name} successful :)`,
					body: `:)`
				};
				log.info(`emailParams:${toStr(emailParams)}`);
				send(emailParams);
			} catch (e) {
				log.error(e.message, e);
			}
		}
	} // stop


} // class Collector
