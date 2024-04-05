import {
	fold,
	hasOwnProperty,
	isObject,
} from '@enonic/js-utils';
// import {toStr} from '@enonic/js-utils/value/toStr';
import {
	FIELD_PATH_GLOBAL,
	FIELD_PATH_META
} from '../constants';


// @ts-ignore Import assignment cannot be used when targeting ECMAScript modules.
import traverse = require('traverse');


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
}) {
	// log.debug('constrainPropertyNames data:%s', toStr(data));

	// Fix Bug #284 traverse.clone crashes, replace with JSON.parse(JSON.stringify())
	const constrainedData = JSON.parse(JSON.stringify(data));

	let dirty = true;
	while (dirty) {
		dirty = false;
		// log.debug('constrainPropertyNames constrainedData:%s', toStr(constrainedData));
		traverse(constrainedData).forEach(function(value: unknown) { // Fat arrow destroys this
			/*if (this.level === 0) {
				log.info('────────────────────────────────────────────────────────────────────────────────');
				log.info('root');
				log.info('────────────────────────────────────────────────────────────────────────────────');
			}*/
			//log.info('level:%s path:%s key:%s', this.level, this.path, this.key); // level:0 path:[] key:undefined
			if (
				!this.circular // Why?
			) {
				if (isObject(value)) {
					// log.info('value at path:%s is an object', this.path.join('.'));
					const keys = Object.keys(value);
					// log.info('keys:%s', keys);
					for (let i = 0; i < keys.length; i++) {
						const key = keys[i];
						// log.debug('document.constrainPropertyNames: key:%s', toStr(key));
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
							// log.info('key:%s constrainedKey:%s', key, constrainedKey);
							if (!constrainedKey) {
								log.warning('Key:%s is contrained to nothing! Dropping path:%s value:%s', key, this.path.concat(key).join('.'), value[key]);
								delete value[key];
								dirty = true;
							} else if (constrainedKey !== key) {
								if (hasOwnProperty(value, constrainedKey)) {
									log.warning('Tried to constrain key:%s to:%s, but key already exist on parent! Dropping value:%s', key, constrainedKey, value[key]);
								} else {
									log.debug('Key:%s contrained to:%s :)', key, constrainedKey);
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
						// log.info('updated node:%s', this.node);
					}
				} // isObject
			} // !circular
		}); // traverse
	} // while dirty
	// log.debug('constrainPropertyNames constrainedData:%s', constrainedData);
	return constrainedData;
}
