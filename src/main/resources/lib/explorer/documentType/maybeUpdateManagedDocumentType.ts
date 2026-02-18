import type { DocumentTypesJsonDocumentType } from '../types.d';


// import { toStr } from '@enonic/js-utils/value/toStr';
import { getDocumentTypeByName } from './getDocumentTypeByName';
import { updateDocumentType } from './updateDocumentType';


export function maybeUpdateManagedDocumentType({
	_name,
	addFields = true, // NOTE: Only overrides undefined, not null.
	version = 0, // NOTE: Only overrides undefined, not null.
	managedBy,
	properties = [] // NOTE: Only overrides undefined, not null.
}: DocumentTypesJsonDocumentType & {
	managedBy: string
}) {
	// log.info('_name:%s', _name);
	const existingDocumentType = getDocumentTypeByName({
		documentTypeName: _name
	});
	// log.info('existingDocumentType:%s', toStr(existingDocumentType));
	const {
		_id,
		_versionKey,
		version: existingVersion = 0,
	} = existingDocumentType;
	// log.info('version:%s existingVersion:%s', version, existingVersion);
	if (version > existingVersion) {
		return updateDocumentType({
			_id,
			_name,
			_versionKey,
			addFields,
			version,
			managedBy,
			properties
		});
	}
	return false;
}
