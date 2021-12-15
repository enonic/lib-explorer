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
import {
	VALUE_TYPE_ANY,
	VALUE_TYPE_BOOLEAN,
	VALUE_TYPE_STRING,
	//enonify,
	isNotSet,
	//isSet,
	isString,
	toStr
} from '@enonic/js-utils/dist/esm/index.mjs';
import getIn from 'get-value';

interface LooseObject {
	[key :string] :any
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

interface ValidateTypesParameters {
	readonly data? :LooseObject
	readonly fields? :Field[]
}


const DEFAULT_LOG = {
	debug: (s: string) /*:void*/ => {
		return s;
	},
	error: (s: string) /*:void*/ => {
		return s;
	},
	warning: (s: string) /*:void*/ => {
		return s;
	}
};


export function validateTypes({
	data = {},
	fields = []
} :ValidateTypesParameters = {} , {
	log = DEFAULT_LOG
} = {}) {
	//log.debug(`validateTypes data:${toStr(data)}`);
	//log.debug(`validateTypes fields:${toStr(fields)}`);

	/*const enonifiedData = enonify(data); // NOTE enonify stringifies new Date(), etc
	log.debug(`validateOccurrences enonifiedData:${toStr(enonifiedData)}`);*/

	for (var i = 0; i < fields.length; i++) {
		const {
			valueType = VALUE_TYPE_STRING,
			name
		} = fields[i];
		log.debug(`validateTypes name:${name} valueType:${valueType}`);

		const value = getIn(data, name);
		if (isNotSet(value) || valueType === VALUE_TYPE_ANY) {
			break;
		}

		switch (valueType) {
		case VALUE_TYPE_STRING:
		case 'text': // TODO Remove in lib-explorer-4.0.0/app-explorer-2.0.0 ?
		case 'html':
		case 'tag':
		case 'uri':
		//case 'xml':
			if (!isString(value)) {
				const msg = `validateTypes: Not a string:${toStr(value)} at path:${name} in data:${toStr(data)}!`
				log.debug(msg);
				return false;
			}
			break;
		case VALUE_TYPE_BOOLEAN:
			if (typeof value !== VALUE_TYPE_BOOLEAN) {
				const msg = `validateTypes: Not a boolean:${toStr(value)} at path:${name} in data:${toStr(data)}!`
				log.debug(msg);
				return false;
			}
			break;
		default:
			throw new Error(`Unhandeled valueType:${valueType}!`);
		}
	} // for
	return true;
}
