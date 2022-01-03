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
	//VALUE_TYPE_SET,
	VALUE_TYPE_STRING,
	isDate,
	isGeoPointArray,
	isGeoPointString,
	isInstantString,
	isLocalDateString,
	isLocalDateTimeString,
	isTimeString,
	toStr
} from '@enonic/js-utils/dist/esm/index.mjs';
import getIn from 'get-value';
import {v4 as isUuid4} from 'is-uuid';
import setIn from 'set-value';
import traverse from 'traverse';

import {
	geoPointDummy,
	geoPointStringDummy,
	instantDummy,
	localDateDummy,
	localDateTimeDummy,
	localTimeDummy,
	logDummy,
	referenceDummy
} from './dummies';


interface LooseObject {
	[key :string] :unknown
}

interface Field {
	//readonly enabled :boolean
	//readonly fulltext :boolean
	//readonly includeInAllText :boolean
	//readonly max? :number
	//readonly min? :number
	readonly name :string
	//readonly nGram :boolean
	//readonly path :boolean
	readonly valueType? :string
}

interface TypeCastToJavaParameters {
	readonly data? :LooseObject
	readonly fields? :Field[]
}

/*interface TypeCastToJavaOptions {
	readonly log :LooseObject
	readonly geoPoint
}*/


export function typeCastToJava({
	data = {},
	fields = []
} :TypeCastToJavaParameters = {}, {
	log = logDummy,
	geoPoint = geoPointDummy,
	geoPointString = geoPointStringDummy,
	instant = instantDummy,
	localDate = localDateDummy,
	localDateTime = localDateTimeDummy,
	localTime = localTimeDummy,
	reference = referenceDummy
} = {}) {
	//log.debug(`typeCastToJava data:${toStr(data)}`);
	//log.debug(`typeCastToJava fields:${toStr(fields)}`);

	const fieldToValueTypeObj :LooseObject = {};
	for (let i = 0; i < fields.length; i++) {
		const {
			valueType = VALUE_TYPE_STRING,
			name
		} = fields[i];
		//log.debug(`typeCastToJava name:${name} valueType:${valueType}`);
		setIn(fieldToValueTypeObj, name, valueType);
	} // for
	//log.debug(`fieldToValueTypeObj:${toStr(fieldToValueTypeObj)}`);

	//const typeCastedData :LooseObject = JSON.parse(JSON.stringify(data));
	const typeCastedData :LooseObject = {};
	traverse(data).forEach(function(value) { // Fat arrow destroys this
		if (
			this.notRoot
			&& !this.path[0].startsWith('_')
			&& !this.circular // Why?
		) {
			const pathString = this.path.join('.');
			//log.debug(`pathString:${toStr(pathString)}`);
			const valueTypeForPath = getIn(fieldToValueTypeObj, pathString);
			//log.debug(`pathString:${toStr(pathString)} valueTypeForPath:${toStr(valueTypeForPath)}`);
			if (valueTypeForPath) {
				if ([
					VALUE_TYPE_ANY, // What is the data is a set?
					VALUE_TYPE_BOOLEAN,
					VALUE_TYPE_DOUBLE,
					VALUE_TYPE_LONG,
					//VALUE_TYPE_SET,
					VALUE_TYPE_STRING
				].includes(valueTypeForPath)) {
					setIn(typeCastedData, pathString, value);
					//this.update(value, true); // I actually don't need to update the value, but it's the only way to stopHere?
					this.block();
				} else if (valueTypeForPath === VALUE_TYPE_GEO_POINT) {
					if (isGeoPointArray(value)) {
						try {
							const javaGeoPoint = geoPoint(value);
							setIn(typeCastedData, pathString, javaGeoPoint);
							//this.update(javaGeoPoint, true);
							this.block();
						} catch (e) {
							log.error(`isGeoPointArray:true but geoPoint(${toStr(value)}) failed!`, e);
						}
					} else if(isGeoPointString(value)) {
						try {
							const javaGeoPoint = geoPointString(value);
							setIn(typeCastedData, pathString, javaGeoPoint);
							//this.update(javaGeoPoint, true);
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
							//this.update(javaInstant, true);
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
							//this.update(javaLocalDate, true);
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
							//this.update(javaLocalDateTime, true);
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
							//this.update(javaLocalTime, true);
							this.block();
						} catch (e) {
							log.error(`isDate or isTimeString is true, but localTime(${toStr(value)}) failed!`, e);
						}
					} else {
						log.warning(`Not an LocalTime! value:${toStr(value)} at path:${pathString} in data:${toStr(data)}`);
					}
				} else if (valueTypeForPath === VALUE_TYPE_REFERENCE) {
					if (isUuid4(value)) {
						try {
							const javaReference = reference(value);
							setIn(typeCastedData, pathString, javaReference);
							//this.update(javaReference, true);
							this.block();
						} catch (e) {
							log.error(`isUuid4:true, but reference(${toStr(value)}) failed!`, e);
						}
					} else {
						log.warning(`Not an Reference/UUIDv4! value:${toStr(value)} at path:${pathString} in data:${toStr(data)}`);
					}
				}
			} else { // !valueTypeForPath
				log.debug(`Field without valueType path:${pathString} value:${toStr(value)}`);
				//this.update(value, true);
				setIn(typeCastedData, pathString, value);
				this.block();
			}
		}
	}); // traverse
	log.debug('typeCastedData', typeCastedData);
	return typeCastedData;
}