//──────────────────────────────────────────────────────────────────────────────
// When a developer codes a collector task.
// The current idea is that the task should persist documents in single collection repo.
// And typically use a single documentType within that single collection repo.
//
// However each call to persistDocument() may update the documentType fields.
// So the documentType needs to be read before/during persistDocument.
//
// Also some configuration can be changed at any time by a search administrator.
//
// The unconfigurables are:
// * collectorId TODO Should the task "die" if a collectionNode is deleted? I think yes.
//
// The configurables used within the Collector class are:
// * collectionName -> collectionRepoId
// * documentTypeId An admin can change which documentType a collection is using.
//
// The "new" document-layer supports either
// 1. passing in the minimal collectionId and reading everything itself from the explorer repo, or
// 2. passing in everything needed without even reading from the explorer repo, or
// 3. something in between those two
//
// In order to release app-explorer-2.0.0 ASAP the safest and minimal, but
// extendable approach is to simply pass along collectionId and let the
// document-layer do it's thing.
// Later we can extend with all the document-layer support, but at the same time
// leave the pitfalls in the hands of the Collector developer.
//──────────────────────────────────────────────────────────────────────────────
// import type { Node } from '/lib/xp/node';
import type {
	QueryDSL,
	SortDSLExpression
} from '@enonic/js-utils/types';
import type {
	Aggregations,
	CollectionNode,
	// CollectionNodeSpecific,
	DocumentNode,
	Id,
	JournalMessage,
	Name,
	NestedRecordType,
	NotificationsNode,
	ParentPath,
	QueryFilters//,
	//RequiredNodeProperties
} from '/lib/explorer/types/index.d';
import type {Progress} from '../task/progress';

import {
	//VALUE_TYPE_STRING,
	isNotSet,
	toStr//,
	//uniqueId
} from '@enonic/js-utils';

//import {validateLicense} from '/lib/license';

//@ts-ignore
import {send} from '/lib/xp/mail';

import {PRINCIPAL_EXPLORER_READ} from '/lib/explorer/constants'; // Start with / so it stays an external bundle
import {createOrUpdate} from '/lib/explorer/document'; // It's own bundle
import {queryDocuments} from '/lib/explorer/document/queryDocuments';
import {get as getCollection} from '../collection/get';
import {get as getNode} from '../node/get';
import {connect} from '../repo/connect';
import {progress} from '../task/progress';
import {get as getTask} from '../task/get';
import {modify as modifyTask} from '../task/modify';
//import {javaLocaleToSupportedLanguage} from '/lib/explorer/stemming/javaLocaleToSupportedLanguage';

//import {getTotalCount} from '/lib/explorer/collection/getTotalCount';

import {Collection} from './Collection';
import {Journal} from './Journal';


const DEBUG = false;
const TRACE = false;

// @ts-ignore
const {currentTimeMillis} = Java.type('java.lang.System') as {
	currentTimeMillis: () => number
};


export class Collector<Config extends NestedRecordType = NestedRecordType> {
	public collection: Collection // Public in lib-explorer-3.x
	public config: Config // Public in lib-explorer-3.x // TODO
	public journal: Journal // Public in lib-explorer-3.x
	public startTime: number // Public in lib-explorer-3.x
	public taskProgressObj: Progress // Public in lib-explorer-3.x

	// "#" is js runtime and better than "private" typescript compiletime
	// but cannot be used when target < "es6"
	//_collectionDefaultDocumentTypeId;
	private _collectionId: string; // New in lib-explorer-4.0.0
	private _collectionName: string; // Private from lib-explorer-4.0.0
	private _collectorId: string; // Private from lib-explorer-4.0.0
	//_documentTypeObj: FieldsObject;
	//_documentTypesObj;
	private _language: string; // Private in lib-explorer-3.x

	constructor({
		collectionId,
		collectorId, // Present in lib-explorer-3.x
		configJson, // Present in lib-explorer-3.x
		language, // Present in lib-explorer-3.x
		name // Present in lib-explorer-3.x
	}: {
		collectionId?: string
		collectorId: string
		configJson: string
		language?: string
		name?: string
	}) {
		log.debug('Collector.constructor: collectionId:%s', collectionId);
		//log.debug('Collector.constructor: collectorId:%s', collectorId);
		//log.debug('Collector.constructor: configJson:%s', configJson);
		//log.debug('Collector.constructor: language:%s', language);
		//log.debug('Collector.constructor: name:%s', name);

		/*if (!collectionId) { // TODO lib-explorer-5.0.0
			throw new Error('Collector.constructor: Missing required parameter collectionId!');
		}*/
		if (!collectorId) { throw new Error('Missing required parameter collectorId!'); }
		if (!configJson) { throw new Error('Missing required parameter configJson!'); }
		if (!collectionId && !name) { // TODO remove in lib-explorer-5.0.0
			throw new Error('Collector.constructor: You have to provide collectionId or name(deprecated)!');
		}

		const explorerRepoReadConnection = connect({
			principals: [PRINCIPAL_EXPLORER_READ]
		});

		let collectionNode: CollectionNode;
		if (collectionId) {
			collectionNode = explorerRepoReadConnection.get(collectionId);
			if (!collectionNode) {
				throw new Error(`Collector.constructor: Unable to get collection node with id:${collectionId}!`);
			}
			//log.debug(`collectionNode:${toStr(collectionNode)}`);
			this._collectionId = collectionId;
			this._collectionName = collectionNode._name;
		} else { // !collectionId // TODO remove in lib-explorer-5.0.0
			if (name) {
				log.warning(`Collector constructor: Parameter 'name' is deprecated in lib-explorer-4.0.0 and will be removed in lib-explorer-5.0.0, use collectionId instead!`);
				collectionNode = getCollection({
					connection: explorerRepoReadConnection,
					name
				}) as CollectionNode;
				if (!collectionNode) {
					throw new Error(`Collector.constructor: Unable to find collection from name:${name}!`);
				}
				//log.debug(`collectionNode from name:${toStr(collectionNode)}`);
				this._collectionId = collectionNode._id;
				this._collectionName = name;
			}
		}
		//log.debug(`this._collectionId:${this._collectionId}`);
		//log.debug(`this._collectionName:${this._collectionName}`);

		this._collectorId = collectorId;
		//log.debug(`this._collectorId:${this._collectorId}`);

		if (language) {
			//this._language = javaLocaleToSupportedLanguage(language);
			this._language = language; // Reducing to stemmingLanguage happens inside create and update
		}
		//log.debug(`this._language:${this._language}`);

		// Collections created by Collectors doesn't have documentType...
		/*if (collectionNode.documentTypeId) {
			throw new Error(`The collection with id:${this._collectionId} is missing a documentTypeId!`);
		}
		this._collectionDefaultDocumentTypeId = collectionNode.documentTypeId;
		const documentTypeNode = explorerRepoReadConnection.get(this._collectionDefaultDocumentTypeId);
		this._documentTypesObj[this._collectionDefaultDocumentTypeId] = documentTypeNode;
		log.debug(`this._documentTypesObj:${this._documentTypesObj}`);*/

		/*const collectionsTotalCount = getTotalCount({ connection: explorerRepoReadConnection });
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

	deleteDocument<T extends string|Array<string>>(keys: T): T
	deleteDocument(...keys: Array<string>) {
		return this.collection.connection.delete(...keys) as string|Array<string>;
	}

	getDocumentNode<
		DocumentNode extends NestedRecordType,
		T extends string|Array<string>
	>(keys: T): T extends string ? DocumentNode: Array<DocumentNode>
	getDocumentNode<DocumentNode = unknown>(...keys: Array<string>): DocumentNode|Array<DocumentNode> {
		return this.collection.connection.get<DocumentNode>(...keys);
	}

	progress() {
		TRACE && log.debug(`Collector.progress this.taskProgressObj:${toStr(this.taskProgressObj)}`);
		progress(this.taskProgressObj);
	}

	queryDocuments<
		AggregationKey extends undefined|string = undefined
	>({
		aggregations,
		count,
		filters,
		query,
		sort,
		start
	}: {
		aggregations?: Aggregations<AggregationKey>
		count?: number
		filters?: QueryFilters
		query?: QueryDSL
		sort?: SortDSLExpression
		start?: number
	}) {
		return queryDocuments({
			aggregations,
			collectionRepoReadConnection: this.collection.connection,
			count,
			filters,
			query,
			sort,
			start
		});
	} // queryDocuments

	start() {
		this.startTime = currentTimeMillis();
		this.taskProgressObj = {
			current: 0,
			total: 1, // Or it will appear as there is nothing to do.
			info: {
				name: this._collectionName,
				message: 'Initializing...',
				startTime: this.startTime
			}
		};
		DEBUG && log.debug(`Collector.start this.taskProgressObj:${toStr(this.taskProgressObj)}`);
		this.progress();
		this.collection = new Collection({name: this._collectionName});
		modifyTask({
			connection: this.collection.connection,
			state: 'RUNNING',
			should: 'RUN'
		});
		this.journal = new Journal({
			name: this._collectionName,
			startTime: this.startTime
		});
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
		_id,
		_name,
		_parentPath = '/', // Present in lib-explorer-3.x
		/*document_metadata: {
			...document_metadata_props
		} = {},*/
		...rest // Slurps properties
	}: {
		_id?: Id
		_name?: Name
		_parentPath?: ParentPath
	}, {
		//cleanExtraFields // TODO Perhaps later
		//addExtraFields // TODO Perhaps later
		boolRequireValid, // Present in lib-explorer-3.x

		// When configuring a collection, after having selected a collector,
		// it's no longer possible to select documentType.
		// Thus documentTypeName MUST be provided when persisting a document.
		documentTypeName,

		//validateOccurrences, // TODO Perhaps later
		//validateTypes // TODO Perhaps later
		...ignoredOptions
	}: {
		boolRequireValid?: boolean
		documentTypeName: string
	}) {
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

		if (!documentTypeName) {
			throw new Error('persistDocument(): Missing required parameter documentTypeName!');
		}

		const documentToPersist: {
			_id?: Id
			_name?: Name
			_parentPath: ParentPath
		} = {
			...rest,

			// TODO? lib-explorer-4.0.0 Allow advanced collectors to pass their own.
			//_indexConfig, // Built automatically

			_parentPath
		} ;
		//log.debug(`documentToPersist:${toStr(documentToPersist)}`);

		if (_id) {
			// log.debug('_id:%s', _id);
			documentToPersist._id = _id;
		} else if (_name) {
			const path = `${_parentPath}${_name}`;
			// log.debug('path:%s', path);

			const existingNode = this.collection.connection.get(path) as DocumentNode;
			//log.debug(`existingNode:${toStr(existingNode)}`);

			if (existingNode) {
				documentToPersist._id = existingNode._id; // createOrUpdate doesn't support _path only _id
			}
		}

		//log.debug(`documentToPersist:${toStr(documentToPersist)}`);

		const createOrUpdateParams = {
			collectionId: this._collectionId,
			//collectionName: this.collectionName, // Perhaps later
			collectorId: this._collectorId,
			collectorVersion: app.version,
			//connection: this.collection.connection, // No longer needed in lib-explorer-4.0.0
			data: documentToPersist,
			//documentTypeId // Perhaps later
			documentTypeName,
			//fields: // Perhaps later
			language: this._language,
			//stemmingLanguage: // Perhaps later

			//cleanExtraFields // TODO Perhaps later
			//addExtraFields // TODO Perhaps later
			requireValid: boolRequireValid//,
			//validateOccurrences // TODO Perhaps later
			//validateTypes // TODO Perhaps later
		};
		log.debug('Collector.persistDocument: createOrUpdateParams:%s', toStr(createOrUpdateParams));

		const persistedNode = createOrUpdate(createOrUpdateParams);
		if (!persistedNode) {
			throw new Error('Something went wrong when trying to persist a document!');
		}
		//log.debug('persistedNode:%s', toStr(persistedNode));
		return persistedNode;
	} // persistDocument


	addError(error: JournalMessage) {
		this.journal.addError(error);
	}

	addInformation(information: JournalMessage) {
		this.journal.addInformation(information);
	}

	addSuccess(success: JournalMessage) {
		this.journal.addSuccess(success);
	}

	addWarning(warning: JournalMessage) {
		this.journal.addWarning(warning);
	}

	stop() {
		this.journal.create();
		this.taskProgressObj.current = this.taskProgressObj.total; // Make sure it ends at 100%
		this.taskProgressObj.info.message = `Finished with ${this.journal.errors.length} errors.`;
		this.progress(); // This also implicitly sets final currentTime and duration

		const node = (getNode<NotificationsNode>({
			connection: connect({
				principals: [PRINCIPAL_EXPLORER_READ]
			}),
			path: '/notifications'
		}) || {}) as NotificationsNode;
		//log.info(`node:${toStr(node)}`);

		const {emails = []} = node;
		//log.info(`emails:${toStr(emails)}`);

		if (this.journal.errors.length) {
			log.error('errors:%s',toStr(this.journal.errors));
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
						subject: `Collecting to ${this._collectionName} had ${this.journal.errors.length} errors!`,
						body: `${toStr(this.journal.errors)}`
					};
					log.info(`emailParams:${toStr(emailParams)}`);
					send(emailParams);
				} catch (e) {
					log.error(e.message, e);
				}
			}

			DEBUG && log.debug(`Collector.stop this.taskProgressObj:${toStr(this.taskProgressObj)}`);
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
					subject: `Collecting to ${this._collectionName} successful :)`,
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
