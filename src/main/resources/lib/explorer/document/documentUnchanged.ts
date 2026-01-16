import type { ModifiedNode } from '/lib/xp/node';
// import type {Node} from '@enonic-types/lib-explorer';
import type {DocumentNode} from '@enonic-types/lib-explorer/Document.d';


import {
	//enonify,
	toStr
} from '@enonic/js-utils';
import { detailedDiff } from 'deep-object-diff';
//import {detailedDiff} from 'deep-object-diff/dist/detailed'; // [!] Error: 'detailedDiff' is not exported by node_modules/deep-object-diff/dist/detailed/index.js
/* as {
	detailedDiff: (a: object, b:object) => object
};*/
//import * as deepObjectDiff from 'deep-object-diff';

//import * as Diff from 'diff';

//import fastDeepEqual from 'fast-deep-equal'; // [!] Error: 'default' is not exported by node_modules/fast-deep-equal/index.js
//import * as fastDeepEqual from 'fast-deep-equal'; // (!) Cannot call a namespace ('fastDeepEqual')

//import HumanDiff from 'human-object-diff'; // [!] Error: 'default' is not exported by node_modules/human-object-diff/index.js
//import * as HumanDiff from 'human-object-diff'; // This fails when doing app-explorer development build

import {FIELD_PATH_META} from '/lib/explorer/constants';

// const deepObjectDiff = require('deep-object-diff');

// @ts-ignore Import assignment cannot be used when targeting ECMAScript modules.
//import Diff = require('diff');

// @ts-ignore Import assignment cannot be used when targeting ECMAScript modules.
import fastDeepEqual = require('fast-deep-equal');

// @ts-ignore Import assignment cannot be used when targeting ECMAScript modules.
import HumanDiff = require('human-object-diff');

// const {detailedDiff} = deepObjectDiff;

//const {diffJson} = Diff;

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

	// These will reflect modifiedTime, but that's ok?
	try {
		// log.debug(`Changes detected in document with id:${id}`);
		// log.debug(`Changes detected in document with id:${id} exisitingDocument:${toStr(exisitingDocument)} maybeChangedDocument:${toStr(maybeChangedDocument)}`);
		log.debug(`Changes detected in document with id:${id} diff:${toStr(detailedDiff(exisitingDocument, maybeChangedDocument))}`);
	} catch (_e) {
		try {
			log.debug(`Changes detected in document with id:${id} diff:${toStr(diffDocument(exisitingDocument, maybeChangedDocument))}`);
		} catch (_e) {
			try {
				//log.debug(`Changes detected in document with id:${id} diff:${toStr(diffJson(exisitingDocument, maybeChangedDocument))}`);
			} catch (_e) {
				// No-op :)
			} // catch3
		} // catch2
	} // catch1
	return false;
}
