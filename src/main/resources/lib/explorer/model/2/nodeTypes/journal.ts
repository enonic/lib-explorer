import type {
	IndexConfig,
	ParentPath
} from '/lib/explorer/types.d';
import type {MsgUri} from '/lib/explorer/journal/types.d';

//@ts-ignore
import {instant} from '/lib/xp/value';

import {
	NT_JOURNAL
} from '/lib/explorer/constants';


//@ts-ignore
const {currentTimeMillis} = Java.type('java.lang.System') as {
	currentTimeMillis :() => number
};


interface JournalInput {
	name :string
	startTime :number
	errors? :Array<MsgUri>
	successes? :Array<MsgUri>
}


interface JournalNode extends JournalInput {
	//_id :string
	_indexConfig :IndexConfig
	_name :string
	_nodeType :string
	_parentPath :ParentPath
	//_path :string
	//_permissions :Array<string>
	endTime :number
	duration :number
	errorCount :number
	successCount :number
}


export function journal({
	name,
	startTime,
	errors = [],
	successes = []
} :JournalInput) :JournalNode {
	if (!name) { throw new Error('name is a required parameter'); }
	if (!startTime) { throw new Error('startTime is a required parameter'); }
	const endTime = currentTimeMillis();
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
		errorCount: errors.length,
		successCount: successes.length,
		startTime: instant(new Date(startTime+0.0)) as number, // new Date works on double not integer
		endTime: instant(new Date(endTime+0.0)) as number,
		duration: endTime - startTime,
		errors,
		successes
	};
} // journal
