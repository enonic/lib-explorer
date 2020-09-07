const global = (1, eval)('this'); // https://stackoverflow.com/questions/9107240/1-evalthis-vs-evalthis-in-javascript
global.global = global;
global.globalThis = global;
global.frames = global;
global.self = global;
global.window = global;

if (!Object.entries) {
	Object.entries = function(obj) {
		var ownProps = Object.keys(obj),
			i = ownProps.length,
			resArray = new Array(i); // preallocate the Array
		while (i--)
			resArray[i] = [ownProps[i], obj[ownProps[i]]];
		return resArray;
	};
}
