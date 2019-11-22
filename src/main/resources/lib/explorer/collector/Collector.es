const {currentTimeMillis} = Java.type('java.lang.System');

import {toStr} from '/lib/util';

import {createOrModify} from '/lib/explorer/node/createOrModify';
import {progress} from '/lib/explorer/task/progress';
import {get as getTask} from '/lib/explorer/task/get';
import {modify as modifyTask} from '/lib/explorer/task/modify';

import {Document} from '/lib/explorer/model/2/nodeTypes/document';

import {Collection} from '/lib/explorer/collector/Collection';
import {Journal} from '/lib/explorer/collector/Journal';


export class Collector {


	constructor({name, configJson}) {
		if (!name) { throw new Error('Missing required parameter name!'); }
		this.name = name;
		if (!configJson) { throw new Error('Missing required parameter configJson!'); }
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
			log.warning(`Got message to stop task: ${toStr(collector.taskProgressObj)}`);
			return true;
		}
		return false;
	} // shouldStop


	persistDocument(data) {
		//log.info(`persistDocument(${toStr(data)})`);
		if (!data.uri) { throw new Error('persistDocument: Missing required parameter uri!'); }
		data.__connection = this.collection.connection;
		const persistedNode = createOrModify(Document(data)); //log.info(toStr({persistedNode}));
		if (!persistedNode) {
			throw new Error('Something went wrong when trying to persist a document!');
		}
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
		if (this.journal.errors.length) {
			log.error(toStr({failedUris: this.journal.errors}));
			modifyTask({
				connection: this.collection.connection,
				state: 'FAILED',
				should: 'STOP'
			});
			throw new Error(JSON.stringify(this.taskProgressObj.info)); // Throw so task state becomes FAILED.
			//throw new Error(this.taskProgressObj.info.message); // Throw so task state becomes FAILED.
		}
		modifyTask({
			connection: this.collection.connection,
			state: 'FINISHED',
			should: 'STOP'
		});
	} // stop


} // class Collector
