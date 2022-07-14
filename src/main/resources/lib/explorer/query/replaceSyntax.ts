//import {isSet} from '@enonic/js-utils';


// Inlined to ava tests can run
function isSet(value :unknown) {
	if (typeof value === 'boolean') { return true; } // If value is true/false it is set
	return value !== null && typeof value !== 'undefined';
}


export function replaceSyntax({
	string,
	replacement = ' '
}) {
	if(!isSet(string)) { return string; }
	return string
		.replace(/[-+*|()"]+/g, replacement)
		.replace(/~[0-9]*/g, replacement);
}
