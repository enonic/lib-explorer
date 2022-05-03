import type {JavaBridge} from '../../_coupling/types.d';
import type {
	Field,
	Fields,
	FieldsObject
} from '../../types/Field.d';


import {
	INDEX_CONFIG_ENABLED_DEFAULT,
	INDEX_CONFIG_FULLTEXT_DEFAULT,
	INDEX_CONFIG_INCLUDE_IN_ALL_TEXT_DEFAULT,
	INDEX_CONFIG_N_GRAM_DEFAULT,
	INDEX_CONFIG_PATH_DEFAULT,
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
	VALUE_TYPE_SET,
	VALUE_TYPE_STRING,
	//forceArray,
	isBoolean,
	isObject,
	isPositiveInteger,
	isString,
	toStr
} from '@enonic/js-utils';

//import {javaBridgeDummy} from '../dummies';


const BOOLEAN_PROPS = [
	'active', // TODO: From GUI
	'enabled', 'fulltext', 'includeInAllText', 'nGram','path'];
Object.freeze(BOOLEAN_PROPS);

const POSITIVE_INTEGER_PROPS = ['max', 'min'];
Object.freeze(POSITIVE_INTEGER_PROPS);

const ALLOWED_PROPS = [].concat(
	BOOLEAN_PROPS,
	POSITIVE_INTEGER_PROPS,
	['name', 'valueType']
);
Object.freeze(ALLOWED_PROPS);

const VALUE_TYPES = [
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
	VALUE_TYPE_SET,
	VALUE_TYPE_STRING
];
Object.freeze(VALUE_TYPES);


export function isField(
	value :unknown,
	javaBridge :JavaBridge// = javaBridgeDummy
) :value is Field {
	const {log} = javaBridge;
	//log.debug('isField() value:%s', value);
	if (!isObject(value)) { return false; }
	const keys :string[] = Object.keys(value as Object);
	for (let i = 0; i < keys.length; i++) {
		//log.debug('isField() i:%s', i);
		const key = keys[i];
		//log.debug('isField() i:%s key:%s', i, key);
		if (!ALLOWED_PROPS.includes(key)) {
			log.error(`key:${key} is not an allowed property on interface Field!`);
			return false;
		} else {
			const property = value[key];
			//log.debug('isField() i:%s key:%s property:%s', i, key, property);
			if (BOOLEAN_PROPS.includes(key)) {
				if (!isBoolean(property)) {
					log.error(`key:${key} value:${toStr(property)} is not of type boolean on interface Field!`);
					return false;
				}
			} else if (POSITIVE_INTEGER_PROPS.includes(key)) {
				if (!isPositiveInteger(property)) {
					log.error(`key:${key} value:${toStr(property)} is not of type PositiveInteger on interface Field!`);
					return false;
				}
			} else if (key === 'name') {
				if (!isString(property)) {
					log.error(`key:${key} value:${toStr(property)} is not of type String on interface Field!`);
					return false;
				}
			} else if (key === 'valueType') {
				if (!VALUE_TYPES.includes(property)) {
					log.error(`key:${key} value:${toStr(property)} is not of type ValueType on interface Field!`);
					return false;
				}
			}
		} // else ALLOWED_PROPS
	} // for keys
	return true;
}


export function isFields(
	fields :unknown,
	javaBridge :JavaBridge// = javaBridgeDummy
) :fields is Fields {
	//const {log} = javaBridge;
	//log.debug('isFields() fields:%s', fields);
	if (!Array.isArray(fields)) { return false; }
	for (let i = 0; i < fields.length; i++) {
		//log.debug('isFields() i:%s', i);
		const field = fields[i];
		//log.debug('isFields() i:%s field:%s', i, field);
		if (!isField(field, javaBridge)) {
			return false;
		}
	}
	return true;
}


export function applyDefaultsToField(
	field :Partial<Field>,
	javaBridge :JavaBridge// = javaBridgeDummy
) :Readonly<Required<Field>> {
	//const {log} = javaBridge;
	if (!isField(field, javaBridge)) {
		throw new TypeError(`applyDefaultsToField: field not of type Field! field:${toStr(field)}`);
	}
	const {
		active = true,
		enabled = INDEX_CONFIG_ENABLED_DEFAULT,
		fulltext = INDEX_CONFIG_FULLTEXT_DEFAULT,
		includeInAllText = INDEX_CONFIG_INCLUDE_IN_ALL_TEXT_DEFAULT,
		max = 0,
		min = 0,
		name,
		nGram = INDEX_CONFIG_N_GRAM_DEFAULT,
		path = INDEX_CONFIG_PATH_DEFAULT,
		valueType = VALUE_TYPE_STRING
	} = field;
	const FIELD :Partial<Field> = {
		active,
		enabled,
		fulltext,
		includeInAllText,
		max,
		min,
		nGram,
		path,
		valueType
	};
	if (name) {
		FIELD.name = name;
	}
	//Object.freeze(FIELD);
	//return FIELD as Readonly<Required<Field>>;
	return FIELD as Required<Field>;
}


export function fieldsArrayToObj(
	//field :Fields | Field,
	fields :Fields,
	javaBridge :JavaBridge// = javaBridgeDummy
) :FieldsObject {
	//const fields = forceArray(field);
	if (!isFields(fields, javaBridge)) { // NOTE Allowing empty array
		throw new TypeError(`fieldsArrayToObj: fields not of type Fields! fields:${toStr(fields)}`);
	}
	const FIELDS_OBJ :FieldsObject = {};
	for (let i = 0; i < fields.length; i++) {
		const field = applyDefaultsToField(fields[i], javaBridge);
		const {name, ...rest} = field;
		FIELDS_OBJ[name] = rest;
	}
	//Object.freeze(FIELDS_OBJ);
	return FIELDS_OBJ;
}


export function fieldsObjToArray(
	fieldsObj :FieldsObject,
	javaBridge :JavaBridge// = javaBridgeDummy
) :Fields {
	return Object.keys(fieldsObj).map(pathString => ({
		...applyDefaultsToField(fieldsObj[pathString], javaBridge),
		name: pathString
	}));
}


export function addMissingSetToFieldsArray(
	fields :Fields,
	javaBridge :JavaBridge// = javaBridgeDummy
) :Fields {
	const {log} = javaBridge;
	if (!isFields(fields, javaBridge)) { // NOTE Allowing empty array
		throw new TypeError(`addMissingSetToFields: fields not of type Fields! fields:${toStr(fields)}`);
	}
	const returnFields :Fields = JSON.parse(JSON.stringify(fields));
	const fieldsObj = fieldsArrayToObj(fields, javaBridge);
	for (let i = 0; i < fields.length; i++) {
		const field = fields[i];
		let {name: path} = field;
		log.debug(`path:${path}`);
		while (path.includes('.')) {
			path = path.split('.').slice(0,-1).join('.');
			log.debug(`path:${path}`);
			if (!fieldsObj[path]) {
				log.debug(`Adding missing set at path:${path}`);
				returnFields.push(applyDefaultsToField({
					name: path,
					valueType: VALUE_TYPE_SET
				}, javaBridge));
			}
		}
	}
	log.debug(`returnFields:${toStr(returnFields)}`);
	returnFields.sort(({name: nameA},{name: nameB}) => { // in-place
		if (nameA < nameB) {
    		return -1;
  		}
  		if (nameA > nameB) {
    		return 1;
  		}
  		return 0;
	});
	log.debug(`sorted returnFields:${toStr(returnFields)}`);
	//Object.freeze(returnFields);
	return returnFields;
}
