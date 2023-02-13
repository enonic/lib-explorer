import type {
	JournalNode,
	JournalType
} from '/lib/explorer/types/index.d';

import {coerceArray} from '/lib/explorer/array/coerceArray';
import {zeroIfUnset} from '/lib/explorer/number/zeroIfUnset';


export function coerceJournalType({
	_id,
	_name,
	_nodeType,
	_path,
	_versionKey,
	endTime,
	errorCount, // = 0,
	errors = [], // handles undefined, but not null
	duration,
	informations = [],
	name,
	startTime,
	successCount, // = 0,
	successes = [],
	warnings = [],
	warningCount, // = 0,
}: JournalNode): JournalType {
	return {
		_id,
		_name,
		_nodeType,
		_path,
		_versionKey,
		endTime,
		errorCount: zeroIfUnset(errorCount),
		errors: coerceArray(errors),
		duration,
		name,
		informations: coerceArray(informations),
		startTime,
		successCount: zeroIfUnset(successCount),
		successes: coerceArray(successes),
		warnings: coerceArray(warnings),
		warningCount: zeroIfUnset(warningCount),
	};
}
