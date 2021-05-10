import getIn from 'get-value';
import setIn from 'set-value';
import traverse from 'traverse';

import {NT_DOCUMENT} from '/lib/explorer/model/2/constants';
//import {ValidationError} from '/lib/explorer/document/ValidationError.es';
import {ValidationError} from './ValidationError.es';
import {isInt, isString} from '/lib/util/value.js';
import {toStr} from '/lib/util';
import {
	geoPoint, // [lat, long]
	geoPointString, // 'lat,long'
	instant,
	localDate,
	localDateTime,
	localTime/*,
	reference*/
} from '/lib/xp/value.js';


// Any Float number with a zero decimal part are implicitly cast to Integer,
// so it is not possible to check if they are Float or not.
function isFloat(n){
	return Number(n) === n;
	//return Number(n) === n && n % 1 !== 0; //

	// Test whether a value is a number primitive value that has no fractional
	// part and is within the size limits of what can be represented as an exact integer
	//return n === +n && n !== (n|0);
}


export const isObject = (value) => Object.prototype.toString.call(value).slice(8,-1) === 'Object';


export function tryApplyValueType({
	fields,
	path,
	value
}) {
	//log.debug(`path:${path.join('.')} value:${toStr(value)} fields:${toStr(fields)}`);
	const field = getIn(fields, path);
	// Path may contain an array index. So no matching field can be found...
	//log.debug(`path:${path.join('.')} value:${toStr(value)} field:${toStr(field)}`);
	if(!field) {
		return value;
	}
	const valueType = field.valueType; // Works for 'obj.property', but not 'arr.0'
	//log.debug(`path:${path.join('.')} value:${toStr(value)} valueType:${valueType}`);
	if(!valueType) {
		return value;
	}

	if ([
		'string',
		'text',
		'uri',
		'tag',
		'html'/*,
		'xml'*/
	].includes(valueType)) {
		if (!isString(value)) {
			throw new ValidationError(`Not a string:${toStr(value)} at path:${path}!`);
		}
	} else if (valueType === 'boolean') {
		if (typeof value !== 'boolean') {
			throw new ValidationError(`Not a boolean:${toStr(value)} at path:${path}!`);
		}
	} else if (valueType === 'long') {
		if (!isInt(value)) {
			throw new ValidationError(`Not an integer:${toStr(value)} at path:${path}!`);
		}
	} else if (valueType === 'double') {
		if (!isFloat(value)) {
			throw new ValidationError(`Not a number:${toStr(value)} at path:${path}!`);
		}
	} else if (valueType === 'set') {
		if (!isObject(value)) {
			throw new ValidationError(`Not a set:${toStr(value)} at path:${path}!`);
		}
	} else if (valueType === 'geoPoint') {
		if (Array.isArray(value)) {
			return geoPoint(...value); // Doesn't take array, must spread
		} else { // Assuming string
			return geoPointString(value);
		}
	} else if (valueType === 'instant') {
		return instant(value);
	} else if (valueType === 'localDate') {
		return localDate(value);
	} else if (valueType === 'localDateTime') {
		return localDateTime(value);
	} else if (valueType === 'localTime') {
		return localTime(value);
	/*} else if (valueType === 'reference') {
		return reference(value);*/
	}
	return value;
}


export function checkAndApplyTypes({
	__boolRequireValid,
	__createdTime = new Date(),
	boolValid, // passed as value, thus local variable
	fields,
	indexConfig,
	nodeToCreate, // modified within function
	rest
}) {
	traverse(rest).forEach(function(value) { // Fat arrow destroys this
		//log.info(`this:${toStr(this)}`); // TypeError: JSON.stringify got a cyclic data structure
		//log.info(`this.path:${toStr(this.path)}`);
		//log.info(`this.isLeaf:${toStr(this.isLeaf)}`);
		//log.info(`this.circular:${toStr(this.circular)}`);
		//log.info(`value:${toStr(value)}`);
		if (
			this.notRoot
			&& !this.path[0].startsWith('_')
			&& !this.circular
		) {
			//log.info(`parent.node:${toStr(parent.node)}`); // TypeError: JSON.stringify got a cyclic data structure
			//log.info(`this.parent.node:${toStr(this.parent.node)}`); // TypeError: JSON.stringify got a cyclic data structure
			if (Array.isArray(value)) {
				if (!getIn(nodeToCreate, this.path)) {
					setIn(nodeToCreate, this.path, []);
				}
				// Check the type of all the array entries
				value.forEach((item) => {
					try {
						tryApplyValueType({ // NOTE: Applied to nodeToCreate later.
							fields,
							path: this.path,
							value: item
						});
					} catch (e) {
						if (__boolRequireValid) {
							throw e;
						} else {
							boolValid = false;
							log.warning(e.message);
						}
					}
				});
			}
			if (this.isLeaf) { // In other words not Array or Set, just a value.
				try {
					const valueWithType = tryApplyValueType({
						fields,
						path: this.path,
						value
					});
					//log.debug(`path:${this.path.join('.')} value:${toStr(value)} valueWithType:${toStr(valueWithType)}`);
					setIn(nodeToCreate, this.path, valueWithType);
					//log.debug(`nodeToCreate:${toStr(nodeToCreate)}`);
				} catch (e) {
					if (__boolRequireValid) {
						throw e;
					} else {
						boolValid = false;
						log.warning(e.message);
						setIn(nodeToCreate, this.path, value);
					}
				}
			}
		}
	});
	//log.info(`nodeToCreate:${toStr(nodeToCreate)}`);

	nodeToCreate._indexConfig = indexConfig;  // Not allowed to control indexConfig
	nodeToCreate._inheritsPermissions = true;
	nodeToCreate._nodeType = NT_DOCUMENT; // Enforce type
	nodeToCreate._parentPath = '/'; // Enforce flat structure
	nodeToCreate._permissions = [];
	nodeToCreate.document_metadata = {
		createdTime: __createdTime,
		//creator: user.key, // Enforce creator
		valid: boolValid
	};
	//log.info(`nodeToCreate:${toStr(nodeToCreate)}`);
}
