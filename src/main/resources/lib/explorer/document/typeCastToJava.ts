import type {
	DocumentNode,
	DocumentTypeField,
	DocumentTypeFieldsObject,
} from '@enonic-types/lib-explorer'

import {
	geoPoint,
	geoPointString,
	instant,
	localDate,
	localDateTime,
	localTime,
	reference
} from '/lib/xp/value';
import {
	VALUE_TYPE_ANY,
	VALUE_TYPE_BOOLEAN,
	VALUE_TYPE_DOUBLE,
	VALUE_TYPE_GEO_POINT,
	VALUE_TYPE_INSTANT,
	VALUE_TYPE_LOCAL_DATE,
	VALUE_TYPE_LOCAL_DATE_TIME,
	VALUE_TYPE_LOCAL_TIME,
	VALUE_TYPE_LONG,
	VALUE_TYPE_REFERENCE,
	// VALUE_TYPE_SET,
	VALUE_TYPE_STRING,
	getIn,
	isDate,
	isGeoPointArray,
	isGeoPointString,
	isInstantString,
	isLocalDateString,
	isLocalDateTimeString,
	isTimeString,
	isUuidV4String,
	setIn
} from '@enonic/js-utils';
import {toStr} from '@enonic/js-utils/value/toStr';
import { includes as arrayIncludes } from '@enonic/js-utils/array/includes';
// import traverse from 'traverse'; // [!] Error: 'default' is not exported by node_modules/traverse/index.js
// import * as traverse from 'traverse'; // (!) Cannot call a namespace ('traverse')

import {
	FIELD_PATH_GLOBAL,
	FIELD_PATH_META
} from '/lib/explorer/constants';

// @ts-ignore Import assignment cannot be used when targeting ECMAScript modules.
import traverse = require('traverse');


export interface TypeCastToJavaParameters {
	data?: Record<string, unknown>
	fieldsObj: DocumentTypeFieldsObject
}


export function typeCastToJava(
	{
		data = {},
		fieldsObj = {}
	}: TypeCastToJavaParameters,
): DocumentNode {
	// log.debug('typeCastToJava data:%s', toStr(data));
	// log.debug('typeCastToJava fieldsObj:%s', toStr(fieldsObj));
	const typeCastedData: DocumentNode = JSON.parse(JSON.stringify(data));
	traverse(data).forEach(function(value: unknown) { // Fat arrow destroys this
		// log.debug('document.typeCastToJava: this.path:%s', toStr(this.path));
		// log.debug('document.typeCastToJava: this.path[0]:%s', toStr(this.path[0]));
		if (
			this.notRoot
			&& !this.path[0].startsWith('_')
			&& !this.circular // Why?
		) {
			const pathString = this.path.join('.');
			// log.debug('pathString:%s', pathString);

			const fieldObjWithoutName = getIn(fieldsObj, pathString, {}) as Required<Omit<DocumentTypeField, 'name'>>;
			// log.debug('fieldObjWithoutName:%s', toStr(fieldObjWithoutName));

			const {
				valueType: valueTypeForPath
			} = fieldObjWithoutName;
			// log.debug(`pathString:${toStr(pathString)} valueTypeForPath:${toStr(valueTypeForPath)}`);
			if (valueTypeForPath) {
				if (arrayIncludes([
					VALUE_TYPE_ANY, // What is the data is a set?
					VALUE_TYPE_BOOLEAN,
					VALUE_TYPE_DOUBLE,
					VALUE_TYPE_LONG,
					// VALUE_TYPE_SET,
					VALUE_TYPE_STRING
				], valueTypeForPath)) {
					setIn(typeCastedData, pathString, value);
					// this.update(value, true); // I actually don't need to update the value, but it's the only way to stopHere?
					this.block();
				} else if (valueTypeForPath === VALUE_TYPE_GEO_POINT) {
					if (isGeoPointArray(value)) {
						try {
							const javaGeoPoint = geoPoint(value[0], value[1]);
							setIn(typeCastedData, pathString, javaGeoPoint);
							// this.update(javaGeoPoint, true);
							this.block();
						} catch (e) {
							log.error(`isGeoPointArray:true but geoPoint(${toStr(value)}) failed!`, e);
						}
					} else if(isGeoPointString(value)) {
						try {
							const javaGeoPoint = geoPointString(value as string);
							setIn(typeCastedData, pathString, javaGeoPoint);
							// this.update(javaGeoPoint, true);
							this.block();
						} catch (e) {
							log.error(`isGeoPointString:true but geoPointString(${toStr(value)}) failed!`, e);
						}
					} else {
						log.warning(`Not a geoPoint! value:${toStr(value)} at path:${pathString} in data:${toStr(data)}`);
					}
				} else if (valueTypeForPath === VALUE_TYPE_INSTANT) {
					if (isDate(value) || isInstantString(value)) {
						try {
							const javaInstant = instant(value);
							setIn(typeCastedData, pathString, javaInstant);
							// this.update(javaInstant, true);
							this.block();
						} catch (e) {
							log.error(`isDate or isInstantString is true, but instant(${toStr(value)}) failed!`, e);
						}
					} else {
						log.warning(`Not an Instant! value:${toStr(value)} at path:${pathString} in data:${toStr(data)}`);
					}
				} else if (valueTypeForPath === VALUE_TYPE_LOCAL_DATE) {
					if (isDate(value) || isLocalDateString(value)) {
						try {
							const javaLocalDate = localDate(value);
							setIn(typeCastedData, pathString, javaLocalDate);
							// this.update(javaLocalDate, true);
							this.block();
						} catch (e) {
							log.error(`isDate or isLocalDateString is true, but localDate(${toStr(value)}) failed!`, e);
						}
					} else {
						log.warning(`Not an LocalDate! value:${toStr(value)} at path:${pathString} in data:${toStr(data)}`);
					}
				} else if (valueTypeForPath === VALUE_TYPE_LOCAL_DATE_TIME) {
					if (isDate(value) || isLocalDateTimeString(value)) {
						try {
							const javaLocalDateTime = localDateTime(value);
							setIn(typeCastedData, pathString, javaLocalDateTime);
							// this.update(javaLocalDateTime, true);
							this.block();
						} catch (e) {
							log.error(`isDate or isLocalDateTimeString is true, but localDateTime(${toStr(value)}) failed!`, e);
						}
					} else {
						log.warning(`Not an LocalDateTime! value:${toStr(value)} at path:${pathString} in data:${toStr(data)}`);
					}
				} else if (valueTypeForPath === VALUE_TYPE_LOCAL_TIME) {
					if (isDate(value) || isTimeString(value)) {
						try {
							const javaLocalTime = localTime(value);
							setIn(typeCastedData, pathString, javaLocalTime);
							// this.update(javaLocalTime, true);
							this.block();
						} catch (e) {
							log.error(`isDate or isTimeString is true, but localTime(${toStr(value)}) failed!`, e);
						}
					} else {
						log.warning(`Not an LocalTime! value:${toStr(value)} at path:${pathString} in data:${toStr(data)}`);
					}
				} else if (valueTypeForPath === VALUE_TYPE_REFERENCE) {
					if (isUuidV4String(value)) {
						try {
							const javaReference = reference(value as string);
							setIn(typeCastedData, pathString, javaReference);
							// this.update(javaReference, true);
							this.block();
						} catch (e) {
							log.error(`isUuid4:true, but reference(${toStr(value)}) failed!`, e);
						}
					} else {
						log.warning(`Not an Reference/UUIDv4! value:${toStr(value)} at path:${pathString} in data:${toStr(data)}`);
					}
				}
			} else { // !valueTypeForPath
				if (!arrayIncludes([FIELD_PATH_GLOBAL, FIELD_PATH_META] as string[], pathString)) {
					log.debug(`Field without valueType path:${pathString} value:${toStr(value)}`);
				}
				// this.update(value, true);
				setIn(typeCastedData, pathString, value);
				this.block();
			}
		}
	}); // traverse
	// log.debug('typeCastToJava typeCastedData %s', typeCastedData);
	return typeCastedData;
}
