import getIn from 'get-value';
import setIn from 'set-value';
import traverse from 'traverse';

import {
	NT_DOCUMENT,
	PRINCIPAL_EXPLORER_READ
} from '/lib/explorer/model/2/constants';
import {connect} from '/lib/explorer/repo/connect';
import {getFields} from '/lib/explorer/field/getFields';
import {toStr} from '/lib/util';
import {isInt, isString} from '/lib/util/value';
//import {getUser} from '/lib/xp/auth';
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


export function getFieldsWithIndexConfigAndValueType() {
	// Get all field defititions
	const fieldRes = getFields({
		connection: connect({
			principals: [PRINCIPAL_EXPLORER_READ]
		})
	});
	//log.info(`fieldRes:${toStr(fieldRes)}`);
	const fields = {};
	fieldRes.hits.forEach(({
		//_name,
		fieldType,
		indexConfig,
		key
	}) => {
		if (key !== '_allText') {
			fields[key] = {
				indexConfig,
				valueType: fieldType
			};
		}
	});
	//log.info(`fields:${toStr(fields)}`);
	return fields;
}


export class ValidationError extends Error {
	constructor(...params) {
		//log.info('ValidationError.constructor');
		//log.info(`ValidationError.constructor params:${toStr(...params)}`);
		//log.info(`ValidationError.constructor params:${toStr(params)}`);
		super(...params);

		// Maintains proper stack trace for where our error was thrown (only available on V8)
		if (Error.captureStackTrace) {
			Error.captureStackTrace(this, ValidationError);
		}

		this.name = 'ValidationError';
		//log.info('ValidationError.constructor end');
	}
}


export function tryApplyValueType({
	fields,
	path,
	value
}) {
	const field = getIn(fields, path);
	if(!field) {
		return field;
	}
	const valueType = field.valueType; // Works for 'obj.property', but not 'arr.0'
	//log.info(`path:${toStr(path)} valueType:${toStr(valueType)} value:${toStr(value)}`);
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
			throw new ValidationError(`Not a string: ${value}`);
		}
	} else if (valueType === 'boolean') {
		if (typeof value !== 'boolean') {
			throw new ValidationError(`Not a boolean: ${value}`);
		}
	} else if (valueType === 'long') {
		if (!isInt(value)) {
			throw new ValidationError(`Not an integer: ${value}`);
		}
	} else if (valueType === 'double') {
		if (!isFloat(value)) {
			throw new ValidationError(`Not a number: ${value}`);
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


export function create({
	__boolRequireValid = true,
	__connection,
	_name, // NOTE if _name is missing, _name becomes same as generated _id

	// Remove from ...rest so it is ignored
	document_metadata, // eslint-disable-line no-unused-vars

	...rest // NOTE can have nested properties, both Array and/or Object
}) {
	/*const user = getUser();
	if (!user) { // CreateNode tries to set owner, and fails when no user
		throw new Error('libAuth.getUser failed, wrap with libContext.run with valid user!');
	}*/

	const nodeToCreate = { _name };

	const fields = getFieldsWithIndexConfigAndValueType();
	const indexConfig = {
		default: 'byType', // TODO Perhaps none?
		configs: [{
			path: 'document_metadata',
			config: 'minimal'
		}]
	};
	Object.keys(fields).forEach((path) => {
		if (getIn(rest, path)) { // NOTE Only add indexConfig for used fields. If fields are added later, one also have to add indexConfig for them...
			indexConfig.configs.push({
				path,
				config: fields[path].indexConfig === 'type' ? 'byType' : fields[path].indexConfig
			});
		}
	});
	//log.info(`indexConfig:${toStr(indexConfig)}`);

	let boolValid = true;
	traverse(rest).forEach(function(value) { // Fat arrow destroys this
		//log.info(`this:${toStr(this)}`); // TypeError: JSON.stringify got a cyclic data structure
		//log.info(`this.path:${toStr(this.path)}`);
		//log.info(`this.isLeaf:${toStr(this.isLeaf)}`);
		//log.info(`this.circular:${toStr(this.circular)}`);
		//log.info(`value:${toStr(value)}`);
		if (
			this.isLeaf
			&& !this.path[0].startsWith('_')
			&& !this.circular
		) {
			//log.info(`parent.node:${toStr(parent.node)}`); // TypeError: JSON.stringify got a cyclic data structure
			//log.info(`this.parent.node:${toStr(this.parent.node)}`); // TypeError: JSON.stringify got a cyclic data structure
			if (
				Array.isArray(this.parent.node)
				&& !getIn(nodeToCreate, this.parent.path)
			) {
				setIn(nodeToCreate, this.parent.path, []);
			}
			try {
				setIn(nodeToCreate, this.path, tryApplyValueType({
					fields,
					path: this.path,
					value
				}));
			} catch (e) {
				if (__boolRequireValid) {
					throw e;
				} else {
					boolValid = false;
					setIn(nodeToCreate, this.path, value);
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
		createdTime: new Date(),
		//creator: user.key, // Enforce creator
		valid: boolValid
	};
	//log.info(`nodeToCreate:${toStr(nodeToCreate)}`);

	const createdNode = __connection.create(nodeToCreate);
	//log.info(`createdNode:${toStr(createdNode)}`);

	return createdNode;
}
