export function hasOperator(text: string): boolean {
	return /[-+*|"~()]/.test(text);
}
