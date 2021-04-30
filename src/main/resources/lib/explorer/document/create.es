import {
	NT_DOCUMENT,
	PRINCIPAL_EXPLORER_READ
} from '/lib/explorer/model/2/constants';
import {connect} from '/lib/explorer/repo/connect';
import {getFields} from '/lib/explorer/field/getFields';
//import {toStr} from '/lib/util';
import {isInt} from '/lib/util/value';
import {getUser} from '/lib/xp/auth';
import {
	geoPoint, // [lat, long]
	geoPointString, // 'lat,long'
	instant,
	localDate,
	localDateTime,
	localTime/*,
	reference*/
} from '/lib/xp/value';


function isFloat(n){
	return Number(n) === n && n % 1 !== 0;
}


export function tryApplyValueType({
	fieldTypes,
	field,
	value
}) {
	if (fieldTypes[field] === 'boolean') {
		if (typeof value !== 'boolean') {
			throw new Error(`Not a boolean: ${value}`);
		}
	} else if (fieldTypes[field] === 'long') {
		if (!isInt(value)) {
			throw new Error(`Not an integer: ${value}`);
		}
	} else if (fieldTypes[field] === 'double') {
		if (!isFloat(value)) {
			throw new Error(`Not a floating point number: ${value}`);
		}
	} else if (fieldTypes[field] === 'geoPoint') {
		if (Array.isArray(value)) {
			return geoPoint(...value); // Doesn't take array, must spread
		} else { // Assuming string
			return geoPointString(value);
		}
	} else if (fieldTypes[field] === 'instant') {
		return instant(value);
	} else if (fieldTypes[field] === 'localDate') {
		return localDate(value);
	} else if (fieldTypes[field] === 'localDateTime') {
		return localDateTime(value);
	} else if (fieldTypes[field] === 'localTime') {
		return localTime(value);
	/*} else if (fieldTypes[field] === 'reference') {
		return reference(value);*/
	}
	return value;
}


export function create({
	__connection,
	_name, // NOTE if _name is missing, _name becomes same as generated _id
	...rest
}) {
	const user = getUser();
	if (!user) { // CreateNode tries to set owner, and fails when no user
		throw new Error('libAuth.getUser failed, wrap with libContext.run with valid user!');
	}

	const nodeToCreate = { _name };

	// Get all field defititions
	const fieldRes = getFields({
		connection: connect({
			principals: [PRINCIPAL_EXPLORER_READ]
		})
	});
	//log.info(`fieldRes:${toStr(fieldRes)}`);
	const fieldTypes = {};
	fieldRes.hits.forEach(({_name, fieldType}) => {
		fieldTypes[_name] = fieldType;
	});
	//log.info(`fieldTypes:${toStr(fieldTypes)}`);

	Object.keys(rest)
		.filter(k => !k.startsWith('_')
			&& ![
				'createdTime',
				'creator',
				'modifiedTime',
				'type'
			].includes(k))
		.forEach((k) => {
			nodeToCreate[k] = tryApplyValueType({
				fieldTypes,
				field: k,
				value: rest[k]
			});
		});
	//log.info(`nodeToCreate:${toStr(nodeToCreate)}`);

	nodeToCreate._indexConfig = {default: 'byType'}; // Not allowed to control indexConfig
	nodeToCreate._inheritsPermissions = true;
	nodeToCreate._parentPath = '/'; // Enforce flat structure
	nodeToCreate._permissions = [];
	nodeToCreate.createdTime = new Date();
	nodeToCreate.creator = user.key; // Enforce creator
	nodeToCreate.type = NT_DOCUMENT; // Enforce type
	//log.info(`nodeToCreate:${toStr(nodeToCreate)}`);

	const createdNode = __connection.create(nodeToCreate);
	//log.info(`createdNode:${toStr(createdNode)}`);

	return createdNode;
}
