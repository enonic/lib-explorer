import type {
	CreateJournalNodeParams,
	JournalInterface,
} from '../../../types.d';


import {instant} from '/lib/xp/value';
import {NT_JOURNAL} from '/lib/explorer/constants';
import {coerceArray} from '/lib/explorer/array/coerceArray';


//@ts-ignore
const {currentTimeMillis} = Java.type('java.lang.System') as {
	currentTimeMillis: () => number
};


export function journal({
	name,
	startTime,
	errors, // = [], // This doesn't handle null
	informations, // = [],
	successes, // = [],
	warnings, // = [],
}: JournalInterface): CreateJournalNodeParams {
	if (!name) { throw new Error('name is a required parameter'); }
	if (!startTime) { throw new Error('startTime is a required parameter'); }
	const endTime = currentTimeMillis();
	const errorsArray = coerceArray(errors);
	const informationsArray = coerceArray(informations);
	const successesArray = coerceArray(successes);
	const warningsArray = coerceArray(warnings);
	return {
		_indexConfig: {
			default: 'minimal',
			configs: [{
				path: 'name',
				config: 'minimal'
			},{
				path: 'errorCount',
				config: 'byType' // 'numeric'
			},{
				path: 'warningCount',
				config: 'byType' // 'numeric'
			},{
				path: 'successCount',
				config: 'byType' // 'numeric'
			},{
				path: 'startTime',
				config: 'byType' // 'datetime'
			},{
				path: 'endTime',
				config: 'byType' // 'datetime'
			},{
				path: 'duration',
				config: 'byType' // 'numeric' // ms
			},{
				path: 'type',
				config: 'minimal'
			}]
		},
		_name: `${name}:${startTime}`,
		_nodeType: NT_JOURNAL,
		_parentPath: '/',
		name,

		errorCount: errorsArray.length,
		warningCount: warningsArray.length,
		successCount: successesArray.length,

		startTime: instant(new Date(startTime+0.0)), // new Date works on double not integer
		endTime: instant(new Date(endTime+0.0)),
		duration: endTime - startTime,

		errors: errorsArray,
		warnings: warningsArray,
		informations: informationsArray,
		successes: successesArray,
	};
} // journal
