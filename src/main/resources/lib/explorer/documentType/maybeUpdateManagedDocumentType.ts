import type { DocumentTypesJsonDocumentType } from '/lib/explorer/types/DocumentType.d';


// import { toStr } from '@enonic/js-utils/value/toStr';
import { getDocumentTypeByName } from './getDocumentTypeByName';
import { updateDocumentType } from './updateDocumentType';


export function maybeUpdateManagedDocumentType({
	_name,
	addFields = true, // NOTE: Only overrides undefined, not null.
	documentTypeVersion = 0, // NOTE: Only overrides undefined, not null.
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
		documentTypeVersion: existingDocumentTypeVersion,
	} = existingDocumentType;
	// log.info('documentTypeVersion:%s existingDocumentTypeVersion:%s', documentTypeVersion, existingDocumentTypeVersion);
	if (documentTypeVersion > existingDocumentTypeVersion) {
		return updateDocumentType({
			_id,
			_name,
			_versionKey,
			addFields,
			documentTypeVersion,
			managedBy,
			properties
		});
	}
	return false;
}
