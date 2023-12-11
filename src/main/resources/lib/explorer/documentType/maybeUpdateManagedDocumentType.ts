import type { DocumentTypesJsonDocumentType } from '/lib/explorer/types/DocumentType.d';


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
	const existingDocumentType = getDocumentTypeByName({
		documentTypeName: _name
	});
	const {
		_id,
		_versionKey,
		documentTypeVersion: existingDocumentTypeVersion,
	} = existingDocumentType;
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
