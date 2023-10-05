import type {JavaBridge} from '../../_coupling/types.d';


import {
	fold,
	hasOwnProperty,
	isObject,
} from '@enonic/js-utils';
// import {toStr} from '@enonic/js-utils/value/toStr';
const traverse = require('traverse');
import {
	FIELD_PATH_GLOBAL,
	FIELD_PATH_META
} from '../../constants';


// Alternatives:
// 1. Allow illegal names (current behaviour)
// 2. Remove punctuation, but allow unicode æøå and uppercase
// 3. Remove punctuation, fold, but allow uppercase
// 4. Lowercase, fold, whitelist (remove punctuation)
// throw error or simply warn...
export function constrainPropertyNames({
	data
}: {
	data: unknown
}, javaBridge: JavaBridge) {
	// javaBridge.log.debug('constrainPropertyNames data:%s', toStr(data));

	// Fix Bug #284 traverse.clone crashes, replace with JSON.parse(JSON.stringify())
	const constrainedData = JSON.parse(JSON.stringify(data));

	let dirty = true;
	while (dirty) {
		dirty = false;
		// javaBridge.log.debug('constrainPropertyNames constrainedData:%s', toStr(constrainedData));
		traverse(constrainedData).forEach(function(value: unknown) { // Fat arrow destroys this
			/*if (this.level === 0) {
				javaBridge.log.info('────────────────────────────────────────────────────────────────────────────────');
				javaBridge.log.info('root');
				javaBridge.log.info('────────────────────────────────────────────────────────────────────────────────');
			}*/
			//javaBridge.log.info('level:%s path:%s key:%s', this.level, this.path, this.key); // level:0 path:[] key:undefined
			if (
				!this.circular // Why?
			) {
				if (isObject(value)) {
					//javaBridge.log.info('value at path:%s is an object', this.path.join('.'));
					const keys = Object.keys(value);
					//javaBridge.log.info('keys:%s', keys);
					for (let i = 0; i < keys.length; i++) {
						const key = keys[i];
						// javaBridge.log.debug('document.constrainPropertyNames: key:%s', toStr(key));
						if (
							this.level !== 0
							|| /* if level is 0 and */ !(
								key.startsWith('_')
								|| key.startsWith(FIELD_PATH_GLOBAL)
								|| key.startsWith(FIELD_PATH_META)
							)
						) {
							const constrainedKey = fold(key)
								.toLowerCase()
								.replace(/^[^a-z]+/, '') // strip everything until the first lowercase letter
								.replace(/[^0-9_a-z]+/g, '_') // replace any illegal char with underscore
								.replace(/_{2,}/g, '_') // replace any double underscore, with a single underscore
								.replace(/_$/, '') // remove any ending underscore
							//javaBridge.log.info('key:%s constrainedKey:%s', key, constrainedKey);
							if (!constrainedKey) {
								javaBridge.log.warning('Key:%s is contrained to nothing! Dropping path:%s value:%s', key, this.path.concat(key).join('.'), value[key]);
								delete value[key];
								dirty = true;
							} else if (constrainedKey !== key) {
								if (hasOwnProperty(value, constrainedKey)) {
									javaBridge.log.warning('Tried to constrain key:%s to:%s, but key already exist on parent! Dropping value:%s', key, constrainedKey, value[key]);
								} else {
									javaBridge.log.debug('Key:%s contrained to:%s :)', key, constrainedKey);
									value[constrainedKey] = value[key];
								}
								delete value[key];
								dirty = true;
							}
						}
					} // for keys
					if (dirty) {
						// All the elements in value will be recursively traversed unless stopHere is true.
						// Whenever an object is changed, continue from root until there are no more objects changed.
						this.update(value, true);
						//javaBridge.log.info('updated node:%s', this.node);
					}
				} // isObject
			} // !circular
		}); // traverse
	} // while dirty
	// javaBridge.log.debug('constrainPropertyNames constrainedData:%s', constrainedData);
	return constrainedData;
}
