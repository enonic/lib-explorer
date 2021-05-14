const {currentTimeMillis} = Java.type('java.lang.System');

import {instant} from '/lib/xp/value';

import {
	NT_JOURNAL
} from '/lib/explorer/model/2/constants';
import {node} from '/lib/explorer/model/2/nodeTypes/node';


export function journal({
	/* eslint-disable no-unused-vars */
	displayName, // avoid from ...rest
	/* eslint-disable no-unused-vars */
	_parentPath = '/',
	name,
	startTime,
	_name= `${name}:${startTime}`,
	endTime = currentTimeMillis(),
	duration = endTime - startTime,
	errors = [],
	errorCount = errors.length,
	successes = [],
	successCount = successes.length,
	...rest
}) {
	delete rest._id;
	delete rest._path;
	delete rest._permissions;
	return node({
		...rest,
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
		_name,
		_nodeType: NT_JOURNAL,
		_parentPath,
		name,
		errorCount,
		successCount,
		startTime: instant(new Date(startTime+0.0)), // new Date works on double not integer
		endTime: instant(new Date(endTime+0.0)),
		duration,
		errors,
		successes
	});
} // journal
