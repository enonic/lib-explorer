export function pad(
	value,
	width,
	padString = ' '
) {
  const str = '' + value; // Cast to string
  return str.length >= width ? str : new Array(width - str.length + 1).join(padString) + str;
}
