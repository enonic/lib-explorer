// This fails when tsup code splitting: true
// import {currentTimeMillis} from '/lib/explorer/time/currentTimeMillis';

//@ts-ignore
import {progress as reportProgress} from '/lib/xp/task';


//@ts-ignore
const {currentTimeMillis} = Java.type('java.lang.System') as {
	currentTimeMillis: () => number
}


type Progress<Info> = {
	_current: number
	_currentTime: number
	_infoObject: Info
	_message: string
	_startTime: number
	_total: number
	addItems: (count: number) => Progress<Info>
	debug: () => Progress<Info>
	error: () => Progress<Info>
	warn: () => Progress<Info>
	finishItem: () => Progress<Info>
	getInfoObject: () => Info & {
		currentTime: number
		message: string
		startTime: number
	}
	getInfoString: () => string
	report: () => Progress<Info>
	setInfo: (info: Info) => Progress<Info>
	setMessage: (message: string) => Progress<Info>
}


function addItems<Info>(count: number): Progress<Info> {
	this._total += count;
	return this; // chainable
}


function debug() {
	log.debug(`[${this._current}/${this._total}] ${this.getInfoString()}`);
	return this; // chainable
}


function error() {
	log.error(`[${this._current}/${this._total}] ${this.getInfoString()}`);
	return this; // chainable
}


function finishItem() {
	this._current += 1;
	return this; // chainable
}


function getInfoObject<Info>(): Info & {
	currentTime: number
	message: string
	startTime: number
} {
	this._currentTime = currentTimeMillis();
	return {
		...this._infoObject,
		currentTime: this._currentTime,
		message: this._message,
		startTime: this._startTime
	};
}


function getInfoString() {
	return JSON.stringify(this.getInfoObject());
}


function report() {
	reportProgress({
		current: this._current,
		info: this.getInfoString(),
		total: this._total
	});
	return this; // chainable
}


function setInfo<Info>(info: Info) {
	this._infoObject = {
		...this._infoObject,
		info
	};
	return this; // chainable
}


function setMessage(message: string) {
	this._message = message;
	return this; // chainable
}

function warn() {
	log.warning(`[${this._current}/${this._total}] ${this.getInfoString()}`);
	return this; // chainable
}

export function constructProgress<Info extends Record<string,unknown> = Record<string,unknown>>({
	message = 'Initializing'
}: {
	message?: string
} = {}) {
	const currentTime = currentTimeMillis();
	const progress: Progress<Info> = {
		_current: 0,
		_currentTime: currentTime,
		//@ts-ignore
		_infoObject: {},
		_message: message,
		_startTime: currentTime,
		_total: 1,
		addItems,
		debug,
		error,
		getInfoObject,
		getInfoString,
		finishItem,
		report,
		setInfo,
		setMessage,
		warn,
	};
	return progress;
} // constructProgress
