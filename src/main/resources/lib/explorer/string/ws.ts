export function ws(string :string) {
	if (!string) {
		return string;
	}
	return string.replace(/\s{2,}/g, ' ').trim();
}
