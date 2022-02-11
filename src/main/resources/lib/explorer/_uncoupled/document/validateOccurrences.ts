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
import type {JavaBridge} from '../../_coupling/types.d';
import type {ValidateOccurrencesParameters} from './types.d';


import {
	enonify,
	getIn,
	isSet,
	isString,
	toStr
} from '@enonic/js-utils';
//import getIn from 'get-value';

//import {javaBridgeDummy} from '../dummies';


function zeroOccurrences(value :unknown) :boolean {
	return !isSet(value)
		|| (isString(value) && value === '')
		|| (Array.isArray(value) && value.length === 0);
}


function moreThanOne(value :unknown) :boolean {
	return !Array.isArray(value) || value.length < 2;
}


function moreThan(value :unknown, max :number) :value is Array<unknown> {
	return max > 0 // Not infinite
		&& Array.isArray(value) // and value an array
		&& value.length > max // and array count larger than limit
}


export function validateOccurrences(
	{
		data = {},
		fields = [],
		partial = false
	} :ValidateOccurrencesParameters = {},
	javaBridge :JavaBridge// = javaBridgeDummy
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
			continue;
		}

		const value = getIn(enonifiedData, name);
		if (partial) {
			if (isSet(value)) {
				if (min > 1 && moreThanOne(value)) {
					const msg = `Expected at least ${min} values at path:${name}!`;
					log.warning(msg);
					return false;
				}
				if (moreThan(value, max)) {
					const msg = `Value occurrences:${value.length} exceeds max:${max} at path:${name}!`;
					log.warning(msg);
					return false;
				}
			} /*else {
				// No value
				// No need to complain regardless of min or max
			}*/
		} else { // Not partial
			if (min > 0) { // Check required fields
				// false is a valid value but NOT Truthy!
				// [] is not a valid value but Truthy!
				if (zeroOccurrences(value)) {
					log.warning(`Field ${name} is required! No value found in ${toStr(data)}`);
					return false;
				}
				if (min > 1 && moreThanOne(value)) {
					const msg = `Expected at least ${min} values at path:${name}!`;
					log.warning(msg);
					return false;
				}
			}
			// At this point field is either:
			// * not required
			// * required with at least one value
			if (moreThan(value, max)) {
				const msg = `Value occurrences:${value.length} exceeds max:${max} at path:${name}!`;
				log.warning(msg);
				return false;
			}
		}

	} // for
	return true;
}
