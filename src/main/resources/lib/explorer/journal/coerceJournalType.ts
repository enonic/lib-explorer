import type {
	JournalNode,
	JournalType
} from '/lib/explorer/types/index.d';


export function coerceJournalType({
	_id,
	_name,
	_nodeType,
	_path,
	_versionKey,
	displayName,
	endTime,
	errorCount,
	errors,
	duration,
	name,
	startTime,
	successCount,
	successes
} :JournalNode) :JournalType {
	return {
		_id,
		_name,
		_nodeType,
		_path,
		_versionKey,
		displayName,
		endTime,
		errorCount,
		errors,
		duration,
		name,
		startTime,
		successCount,
		successes
	};
}
