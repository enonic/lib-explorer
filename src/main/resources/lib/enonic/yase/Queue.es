// FIFO First in, first out

import {isSet} from '/lib/enonic/util/value';


// "Private" Symbols
const QUEUE = '_queue';
const PROCESSING = '_processing';
const DONE = '_done';


// States
const STATE_QUEUED = 'queued';
const STATE_PROCESSING = 'processing';
const STATE_DONE = 'done';


export default class Queue {
	constructor() {
		this[QUEUE] = {};
		this[PROCESSING] = {};
		this[DONE] = {};
	}


	add(id, config) {
		if (isSet(this[QUEUE][id])) { throw new Error(`Not adding ${id} to queue, already in queue!`);}
		if (isSet(this[PROCESSING][id])) { throw new Error(`Not adding ${id} to queue, already processing!`);}
		if (isSet(this[DONE][id])) { throw new Error(`Not adding ${id} to queue, already done!`);}
		this[QUEUE][id] = config;
		return {
			id,
			config,
			state: STATE_QUEUED
		};
	}


	get(id) {
		if (this[QUEUE][id]) { return {id, config: this[QUEUE][id], state: STATE_QUEUED}; }
		if (this[PROCESSING][id]) { return {id, config: this[PROCESSING][id], state: STATE_PROCESSING}; }
		if (this[DONE][id]) { return {id, config: this[DONE][id], state: STATE_DONE}; }
		throw new Error(`${id} not found in queue, processing nor done!`);
	}


	getFirst() {
		const keys = Object.keys(this[QUEUE]);
		if(!keys.length) { return false; } // Queue is empty
		const id = keys[0];
		const config = this[QUEUE][id];
		return {
			id,
			config
		};
	}


	start(id) {
		if (isSet(this[PROCESSING][id])) { throw new Error(`Can't start ${id}. Already beeing processed!`);}
		if (!isSet(this[QUEUE][id])) { throw new Error(`Can't start ${id}. Not in queue!`);}
		if (isSet(this[DONE][id])) { throw new Error(`Can't start ${id}. Already done!`);}
		this[PROCESSING][id] = this[QUEUE][id];
		delete this[QUEUE][id];
		return {
			id,
			config: this[PROCESSING][id],
			state: STATE_PROCESSING
		};
	}


	getAndStartFirst() {
		const first = getFirst();
		if (!first) { return false; } // Queue is empty
		return this.start(first.id);
	}


	finish(id) {
		if (isSet(this[DONE][id])) { throw new Error(`Can't finish ${id}. Already done!`);}
		if (isSet(this[QUEUE][id])) { throw new Error(`Can't finish ${id}. Just in queue, not yet beeing processed!`);}
		if (!isSet(this[PROCESSING][id])) { throw new Error(`Can't finish ${id}. Not beeing processed!`);}
		this[DONE][id] = this[PROCESSING][id];
		delete this[QUEUE][id];
		return {
			id,
			config: this[DONE][id],
			state: STATE_DONE
		};
	}
} // class Queue
