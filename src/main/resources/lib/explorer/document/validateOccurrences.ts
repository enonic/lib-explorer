//──────────────────────────────────────────────────────────────────────────────
//
// There are multiple things that can be validated:
// * That defined fields have correct occurences (covers required)
// * That defined fields have correct type
// * That there are no extra/undefined fields
//
// Since Collectors and Document REST are not allowed to write global fields, we
// only need to validate the DocumentType.
//
//──────────────────────────────────────────────────────────────────────────────
import type {
	JavaBridge,
	ValidateOccurrencesParameters
} from './types';

import {
	enonify,
	isSet,
	isString,
	toStr
} from '@enonic/js-utils/dist/esm/index.mjs';
import getIn from 'get-value';

import {javaBridgeDummy} from './dummies';


export function validateOccurrences(
	{
		data = {},
		fields = []
	} :ValidateOccurrencesParameters = {},
	javaBridge :JavaBridge = javaBridgeDummy
) {
	const {log} = javaBridge;
	//log.debug(`validateOccurrences data:${toStr(data)}`);
	//log.debug(`validateOccurrences fields:${toStr(fields)}`);

	const enonifiedData = enonify(data);
	//log.debug(`validateOccurrences enonifiedData:${toStr(enonifiedData)}`);

	for (let i = 0; i < fields.length; i++) {
		const {
			max = 0,
			min = 0,
			name
		} = fields[i];
		//log.debug(`name:${name} min:${min} max:${max}`);
		if (min === 0 && max === 0) {
			break;
		}

		const value = getIn(enonifiedData, name);
		if (min > 0) { // Check required fields
			// false is a valid value but NOT Truthy!
			// [] is not a valid value but Truthy!
			if (
				!isSet(value)
				|| (isString(value) && value === '')
				|| (Array.isArray(value) && value.length === 0)
			) {
				log.warning(`Field ${name} is required! No value found in ${toStr(data)}`);
				return false;
			}
			if (min > 1) {
				if (!Array.isArray(value) || value.length < 2) {
					const msg = `Expected at least ${min} values at path:${name}!`;
					log.warning(msg);
					return false;
				}
			}
		}
		// At this point fields is either not required, or required with at least one value
		if (
			max > 0 // Not infinite
			&& Array.isArray(value) // and value an array
			&& value.length > max // and array count larger than limit
		) {
			const msg = `Value occurrences:${value.length} exceeds max:${max} at path:${name}!`;
			log.warning(msg);
			return false;
		}
	} // for
	return true;
}
