export function insertAdjacentHTML(html :string) :string {
	return `this.insertAdjacentHTML('beforebegin', '${html.replace(/"/g, "\\'").replace(/\n\s*/g, '')}');`;
}
