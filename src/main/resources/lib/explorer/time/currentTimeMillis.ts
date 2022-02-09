/*
 This method the most accurate possible elapsed time in milliseconds since the
 epoch.
*/
//@ts-ignore
export const {currentTimeMillis} = Java.type('java.lang.System') as {
	currentTimeMillis :() => number
};
