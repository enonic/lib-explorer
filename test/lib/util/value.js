export function isInt(value) {
	return !isNaN(value)
		&& parseInt(Number(value), 10) === value
		&& !isNaN(parseInt(value, 10));
}

//export const isObject = (value) => value === Object(value);

//export const isObject = (value) => value === Object(value) && value.constructor === Object;

//export const isObject = (value) => value === Object(value) && !Array.isArray(value);

//export const isObject = (value) => Object.prototype.toString.call(value).slice(8,-1) === 'Object';

export const isString = (value) => typeof value === 'string' || value instanceof String;
