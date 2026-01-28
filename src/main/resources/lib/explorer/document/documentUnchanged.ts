import type { ModifiedNode } from '/lib/xp/node';
import type {DocumentNode} from '@enonic-types/lib-explorer/Document.d';

import {FIELD_PATH_META} from '/lib/explorer/constants';

// @ts-ignore Import assignment cannot be used when targeting ECMAScript modules.
import fastDeepEqual = require('fast-deep-equal');

// @ts-ignore Import assignment cannot be used when targeting ECMAScript modules.
import HumanDiff = require('human-object-diff');

const { diff: diffDocument } = new HumanDiff({
	objectName: 'document'
});


export function documentUnchanged(
	exisitingDocument: DocumentNode,
	maybeChangedDocument: ModifiedNode<DocumentNode>,
): boolean {
	const id = exisitingDocument._id;
	const dereffedExisitingDocument = JSON.parse(JSON.stringify(exisitingDocument));
	const dereffedMaybeChangedDocument = JSON.parse(JSON.stringify(maybeChangedDocument));
	if (dereffedExisitingDocument[FIELD_PATH_META] && dereffedExisitingDocument[FIELD_PATH_META].modifiedTime) {
		delete dereffedExisitingDocument[FIELD_PATH_META].modifiedTime;
	}
	if (dereffedMaybeChangedDocument[FIELD_PATH_META] && dereffedMaybeChangedDocument[FIELD_PATH_META].modifiedTime) {
		delete dereffedMaybeChangedDocument[FIELD_PATH_META].modifiedTime;
	}
	if (fastDeepEqual(dereffedExisitingDocument, dereffedMaybeChangedDocument)) {
		log.debug(`No changes detected, not updating document with id:${id}`);
		return true;
	}

	return false;
}
