import getIn from 'get-value';
import setIn from 'set-value';
import traverse from 'traverse';

import {
	VALUE_TYPE_ANY,
	VALUE_TYPE_BOOLEAN,
	VALUE_TYPE_GEO_POINT,
	VALUE_TYPE_INSTANT,
	VALUE_TYPE_LOCAL_DATE,
	VALUE_TYPE_LOCAL_DATE_TIME,
	VALUE_TYPE_LOCAL_TIME,
	VALUE_TYPE_SET,
	VALUE_TYPE_STRING
} from '@enonic/sdk';
import {ValidationError} from '/lib/explorer/document/ValidationError';
import {isObject} from '/lib/explorer/object/isObject';
import {isInt, isString} from '/lib/util/value';
import {toStr} from '/lib/util';
import {
	geoPoint, // [lat, long]
	geoPointString, // 'lat,long'
	instant,
	localDate,
	localDateTime,
	localTime/*,
	reference*/
} from '/lib/xp/value';


// Any Float number with a zero decimal part are implicitly cast to Integer,
// so it is not possible to check if they are Float or not.
function isFloat(n){
	return Number(n) === n;
	//return Number(n) === n && n % 1 !== 0; //

	// Test whether a value is a number primitive value that has no fractional
	// part and is within the size limits of what can be represented as an exact integer
	//return n === +n && n !== (n|0);
}


function shouldBeType({
	fields,
	pathString,
	type
}) {
	if (!type) {
		throw new Error(`Missing required param type!`);
	}
	const field = fields[pathString];
	if(!field) {
		return false;
	}
	const valueType = field.valueType;
	if(!valueType) {
		return false;
	}
	if (valueType === type) {
		return true;
	}
	return false;
}


function shouldBeGeoPoint({
	fields,
	pathString
}) {
	return shouldBeType({
		fields,
		pathString,
		type: VALUE_TYPE_GEO_POINT
	});
}


export function tryApplyValueType({
	fields,
	pathString,
	value
}) {
	//log.debug(`pathString:${pathString} value:${toStr(value)} fields:${toStr(fields)}`);

	const field = fields[pathString];

	// Path may contain an array index. So no matching field can be found...
	//log.debug(`pathString:${pathString} value:${toStr(value)} field:${toStr(field)}`);
	if(!field) {
		return value;
	}
	const valueType = field.valueType; // Works for 'obj.property', but not 'arr.0'
	//log.debug(`pathString:${pathString} value:${toStr(value)} valueType:${valueType}`);
	if(!valueType || valueType === VALUE_TYPE_ANY) {
		return value;
	}

	if ([
		VALUE_TYPE_STRING,
		'text', // TODO Remove in 2.0 ?
		'uri',
		'tag',
		'html'/*,
		'xml'*/
	].includes(valueType)) {
		if (!isString(value)) {
			throw new ValidationError(`Not a string:${toStr(value)} at pathString:${pathString}!`);
		}
	} else if (valueType === VALUE_TYPE_BOOLEAN) {
		if (typeof value !== VALUE_TYPE_BOOLEAN) {
			throw new ValidationError(`Not a boolean:${toStr(value)} at pathString:${pathString}!`);
		}
	} else if (valueType === 'long') {
		if (!isInt(value)) {
			throw new ValidationError(`Not an integer:${toStr(value)} at pathString:${pathString}!`);
		}
	} else if (valueType === 'double') {
		if (!isFloat(value)) {
			throw new ValidationError(`Not a number:${toStr(value)} at pathString:${pathString}!`);
		}
	} else if (valueType === VALUE_TYPE_SET) {
		if (!isObject(value)) {
			throw new ValidationError(`Not a set:${toStr(value)} at pathString:${pathString}!`);
		}
	} else if (valueType === VALUE_TYPE_GEO_POINT) {
		if (Array.isArray(value)) {
			return geoPoint(...value); // Doesn't take array, must spread
		} else { // Assuming string
			return geoPointString(value);
		}
	} else if (valueType === VALUE_TYPE_INSTANT) {
		return instant(value);
	} else if (valueType === VALUE_TYPE_LOCAL_DATE) {
		return localDate(value);
	} else if (valueType === VALUE_TYPE_LOCAL_DATE_TIME) {
		return localDateTime(value);
	} else if (valueType === VALUE_TYPE_LOCAL_TIME) {
		return localTime(value);
	/*} else if (valueType === 'reference') {
		return reference(value);*/
	}
	return value;
}


export function checkAndApplyTypes({
	boolRequireValid,
	boolValid, // passed as value, thus local variable
	fields,
	inputObject, // only traversed within function
	mode = 'create', // 'diff' | 'update'
	objToPersist // modified within function
}) {
	traverse(inputObject).forEach(function(value) { // Fat arrow destroys this
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
			const pathString = this.path.join('.');
			//log.info(`parent.node:${toStr(parent.node)}`); // TypeError: JSON.stringify got a cyclic data structure
			//log.info(`this.parent.node:${toStr(this.parent.node)}`); // TypeError: JSON.stringify got a cyclic data structure
			if (Array.isArray(value)) {
				if (value.length) { // Not an empty array, which causes issues when diffing...
					const boolShouldBeGeoPoint = shouldBeGeoPoint({
						fields,
						pathString
					});
					//log.debug(`pathString:${pathString} boolShouldBeGeoPoint:${boolShouldBeGeoPoint} value:${toStr(value)}`);
					// Check the type of all the array entries
					if (boolShouldBeGeoPoint) {
						if (mode === 'diff') {
							const geoPointString = `${value[0]},${value[1]}`;
							//log.debug(`Setting pathString:${pathString} to geoPointString:${geoPointString}`);
							setIn(objToPersist, this.path, geoPointString);
						} else {
							try {
								const valueWithType = tryApplyValueType({ // NOTE: Applied to nodeToCreate later.
									fields,
									pathString,
									value
								});
								// If GeoPoint is sent in as an array, it is type checked and applied here.
								// Values for everything but GeoPoint is set via leaf nodes below.
								//log.debug(`Setting pathString:${pathString} to valueWithType:${toStr(valueWithType)}`); // NOTE The GeoPoint valueType is correct but is printed as undefined
								setIn(objToPersist, this.path, valueWithType);
							} catch (e) {
								if (boolRequireValid) {
									throw e;
								} else {
									boolValid = false;
									log.warning(e.message);
									setIn(objToPersist, this.path, value); // Values for everything but GeoPoint is set via leaf nodes below.
								}
							}
						}
					} else { // NOT should be GeoPoint
						if (!getIn(objToPersist, this.path)) {
							setIn(objToPersist, this.path, []);
						}
						if (mode !== 'diff') {
							value.forEach((item) => {
								try {
									tryApplyValueType({ // NOTE: Applied to nodeToCreate later.
										fields,
										pathString,
										value: item
									});
								} catch (e) {
									if (boolRequireValid) {
										throw e;
									} else {
										boolValid = false;
										log.warning(e.message);
									}
								}
							});
						} // !diff
					}
				}
			} // if (Array.isArray(value))
			if (this.isLeaf) { // In other words not Array or Set, just a value.
				if (!Array.isArray(value) || value.length) { // Skip empty arrays which cause issues during diffing
					//log.debug(`leaf value:${toStr(value)}`); // An empty array isLeaf :(
					const parentPathString = this.parent.path.join('.');
					const boolParentShouldBeGeoPoint = shouldBeGeoPoint({
						fields,
						pathString: parentPathString
					});
					//log.debug(`parentPathString:${parentPathString} boolParentShouldBeGeoPoint:${boolParentShouldBeGeoPoint}`);

					// If GeoPoint is sent in as array it is type checked and applied above, thus we have to skip the values here.
					if (!boolParentShouldBeGeoPoint) {
						try {
							if (mode === 'diff') {
								setIn(objToPersist, this.path, value);
							} else { // create | update
								const valueWithType = tryApplyValueType({
									fields,
									pathString,
									value
								});
								//log.debug(`pathString:${pathString} value:${toStr(value)} valueWithType:${toStr(valueWithType)}`);
								setIn(objToPersist, this.path, valueWithType);
							}
							//log.debug(`nodeToCreate:${toStr(nodeToCreate)}`);
						} catch (e) {
							if (boolRequireValid) {
								throw e;
							} else {
								boolValid = false;
								log.warning(e.message);
								setIn(objToPersist, this.path, value);
							}
						} // catch
					} // !boolParentShouldBeGeoPoint
				} // Skip empty arrays
			} // isLeaf
		} // notRoot && !startWith(_) && !circular
	}); // traverse
	//log.info(`nodeToCreate:${toStr(nodeToCreate)}`);

	//creator: user.key, // Enforce creator
	//log.info(`nodeToCreate:${toStr(nodeToCreate)}`);
	return boolValid;
}
