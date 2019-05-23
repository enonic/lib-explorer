import {toStr} from '/lib/util';

// arr[Symbol.iterator] is not a function
//export const dict = arr => Object.assign(...arr.map(([k, v]) => ({ [k]: v })));

export function dict(array) {
	//log.info(toStr({array}));
	const returnObj = {};
	for (let i = 0; i < array.length; i += 1) {
		const objInArray = array[i];
		//log.info(toStr({objInArray}));
		const keys = Object.keys(objInArray);
		for (let j = 0; j < keys.length; j += 1) {
			const key = keys[j];
			const value = objInArray[key];
			if (key in returnObj) {
				log.warning(`key: ${key} already present in obj:${toStr(returnObj)} not overwriting with value:${toStr(value)}`);
			} else {
				returnObj[key] = value;
			}
		}
	}
	//log.info(toStr({returnObj}));
	return returnObj;
}
