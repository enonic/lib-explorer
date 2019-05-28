import {toStr} from '/lib/util';
import {instant} from '/lib/xp/value';
import {
	REPO_JOURNALS,
	NT_JOURNAL
} from '/lib/explorer/model/2/constants';
import {currentTimeMillis} from '/lib/explorer/time/currentTimeMillis';


export const journal = ({
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
	...rest // __connection
}) => {
	return {
		__repoId: REPO_JOURNALS,
		_indexConfig: {
			default: 'none',
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
		//_inheritsPermissions = false
		_name,
		_parentPath,
		//_permissions // TODO Only superadmin and crawler should have access
		name,
		errorCount,
		successCount,
		startTime: instant(new Date(startTime+0.0)), // new Date works on double not integer
		endTime: instant(new Date(endTime+0.0)),
		duration,
		errors,
		successes,
		type: NT_JOURNAL,
		...rest // __connection
	};
}
