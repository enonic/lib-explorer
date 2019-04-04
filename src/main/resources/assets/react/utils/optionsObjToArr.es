import {isString} from './isString';


export function optionsObjToArr(obj) {
	if (Array.isArray(obj)) { // Array of objects
		obj.forEach(({options}, index) => {
			if (options) {
				obj[index].options = optionsObjToArr(options) // Recurse
			}
		});
		return obj;
	}

	// Assume obj
	const arr = [];
	Object.entries(obj).forEach(([k, v]) => {
		const rObj = {
			value: k
		};
		if (isString(v)) {
			rObj.label = v;
		} else { // Assume obj
			rObj.label = v.label;
			if (v.options) {
				rObj.options = optionsObjToArr(v.options); // Recurse
			}
		}
		arr.push(rObj);
	});
	return arr;
}
