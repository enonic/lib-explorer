import getIn from 'get-value';

import {
	VALUE_TYPE_ANY,
	VALUE_TYPE_STRING
} from '@enonic/js-utils';
import {ValidationError} from '/lib/explorer/document/ValidationError';
import {templateToConfig} from '/lib/explorer/indexing/templateToConfig';

//import {toStr} from '/lib/util';
import {isSet} from '/lib/util/value';


export function checkOccurrencesAndBuildIndexConfig({
	boolRequireValid,
	fields,
	indexConfig, // modified within function
	inputObject, // only read from within function
	language
}) {
	//log.debug(`checkOccurrencesAndBuildIndexConfig fields:${toStr(fields)}`);
	//log.debug(`checkOccurrencesAndBuildIndexConfig indexConfig:${toStr(indexConfig)}`);
	//log.debug(`checkOccurrencesAndBuildIndexConfig inputObject:${toStr(inputObject)}`);
	const validationErrors = [];
	Object.keys(fields).forEach((path) => {
		const fieldValue = getIn(inputObject, path);

		const {
			min,// = 0, // Default is not required, Already set
			max,// = 0, // Default is infinite, Already set
			isSystemField,// = false, Already set
			valueType //= VALUE_TYPE_ANY?
		} = fields[path];
		if (min > 0) { // Required
			if (!fieldValue) {
				const msg = `Missing a required value at path:${path}!`;
				validationErrors.push(msg);
				if (boolRequireValid) {
					throw new ValidationError(msg);
				} else {
					log.warning(msg);
				}
			}
			if (min > 1) {
				if (!Array.isArray(fieldValue) || fieldValue.length < 2) {
					const msg = `Expected at least ${min} values at path:${path}!`;
					validationErrors.push(msg);
					if (boolRequireValid) {
						throw new ValidationError(msg);
					} else {
						log.warning(msg);
					}
				}
			}
		}
		if (
			max > 0 // Not infinite
			&& Array.isArray(fieldValue) // and value an array
			&& fieldValue.length > max // and array count larger than limit
		) {
			const msg = `Value occurrences:${fieldValue.length} exceeds max:${max} at path:${path}!`;
			validationErrors.push(msg);
			if (boolRequireValid) {
				throw new ValidationError(msg);
			} else {
				log.warning(msg);
			}
		}

		if (isSet(fieldValue)) { // NOTE Only add indexConfig for used fields. If fields are added later, one also have to add indexConfig for them...
			//log.debug(`path:${path} fieldValue:${toStr(fieldValue)}`);
			const template = fields[path].indexConfig === 'type' ? 'byType' : fields[path].indexConfig;
			//log.debug(`path:${path} template:${toStr(template)}`);
			const languages = [];
			// TODO do not stem system fields?
			if (language && !isSystemField && [
				VALUE_TYPE_ANY,
				VALUE_TYPE_STRING,
				'html', // TODO Remove in lib-explorer-4.0.0/app-explorer-2.0.0 ?
				'tag',
				'text',
				'uri'/*,
				'xml'*/
			].includes(valueType)) {
				languages.push(language);
			}
			const item = {
				path,
				config: templateToConfig({
					template,
					indexValueProcessors: [],
					languages
				})
			};
			//log.debug(`item:${toStr(item)}`);
			indexConfig.configs.push(item);
		} /*else {
			log.debug(`path:${path} has no fieldValue:${toStr(fieldValue)}!`);
		}*/
	}); // forEach path
	indexConfig.configs = indexConfig.configs.sort((a,b) => {
		const pathA = a.path;
		const pathB = b.path;
		if (pathA < pathB) {return -1;}
		if (pathA > pathB) {return 1;}
		return 0;// equal
	});
	//log.debug(`indexConfig.configs:${toStr(indexConfig.configs)}`);
	if (validationErrors.length) {
		throw new ValidationError(validationErrors.join('/n'));
	}
} // function checkOccurrencesAndBuildIndexConfig
