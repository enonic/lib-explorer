const global = (1, eval)('this'); // https://stackoverflow.com/questions/9107240/1-evalthis-vs-evalthis-in-javascript
global.global = global;
global.globalThis = global;
global.frames = global;
global.self = global;
global.window = global;

Number.isInteger = Number.isInteger || function(value) {
	return typeof value === 'number' &&
	isFinite(value) &&
	Math.floor(value) === value;
};
