import getIn from 'get-value';

//import {ValidationError} from '/lib/explorer/document/ValidationError.es';
import {ValidationError} from './ValidationError.es';


export function checkOccurrencesAndBuildIndexConfig({
	fields,
	indexConfig, // modified inside function
	rest
}) {
	Object.keys(fields).forEach((path) => {
		const fieldValue = getIn(rest, path);
		const {
			min = 0, // Default is not required
			max = 0 // Default is infinite
		} = fields[path];
		if (min > 0) { // Required
			if (!fieldValue) {
				throw new ValidationError(`Missing a required value at path:${path}!`);
			}
			if (min > 1) {
				if (!Array.isArray(fieldValue) || fieldValue.length < 2) {
					throw new ValidationError(`Expected at least ${min} values at path:${path}!`);
				}
			}
		}
		if (
			max > 0 // Not infinite
			&& Array.isArray(fieldValue) // and value an array
			&& fieldValue.length > max // and array count larger than limit
		) {
			throw new ValidationError(`Value occurrences:${fieldValue.length} exceeds max:${max} at path:${path}!`);
		}
		if (fieldValue) { // NOTE Only add indexConfig for used fields. If fields are added later, one also have to add indexConfig for them...
			indexConfig.configs.push({
				path,
				config: fields[path].indexConfig === 'type' ? 'byType' : fields[path].indexConfig
			});
		}
	});
}
