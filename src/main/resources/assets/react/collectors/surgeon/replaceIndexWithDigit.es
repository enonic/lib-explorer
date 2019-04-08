export function replaceIndexWithDigit(str) {
	return str.replace(/([^\d]*)(\d+)([^\d]*)/g, (match, before, digits, after/*, offset, string*/) => {
		//console.log({match, before, digits, after, offset, string});
		return `${before}${parseInt(digits) + 1}${after}`;
	})
}
