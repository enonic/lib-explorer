import type {AnyObject} from '@enonic-types/lib-explorer';


// import {toStr} from '@enonic/js-utils/value/toStr';
import traverse from 'traverse';
import {FIELD_PATH_META} from '/lib/explorer/constants';


export function resolveFieldShortcuts({
	basicObject,
	shortcuts = {
		_collection: `${FIELD_PATH_META}.collection`,
		_createdTime: `${FIELD_PATH_META}.createdTime`,
		_documentType: `${FIELD_PATH_META}.documentType`,
		_modifiedTime: `${FIELD_PATH_META}.modifiedTime`
	}
}: {
	basicObject: Object // eslint-disable-line @typescript-eslint/ban-types
	shortcuts?: Record<string,string>
}) {
	// log.debug('resolveFieldShortcuts basicObject:%s ', toStr(basicObject));
	const derefBasicObj: AnyObject = JSON.parse(JSON.stringify(basicObject));
	traverse(derefBasicObj)
		.forEach(function(value) { // forEach updates the object in-place
			if (shortcuts[value] && this.path[this.path.length - 1] === 'field') {
				//log.debug('this.path:%s this.key:%s value:%s ', this.path, this.key, toStr(value));
				this.update(shortcuts[value]);
			}
		}); // forEach
	// log.debug('resolveFieldShortcuts derefBasicObj:%s ', toStr(derefBasicObj));
	return derefBasicObj;
} // resolveFieldShortcuts
