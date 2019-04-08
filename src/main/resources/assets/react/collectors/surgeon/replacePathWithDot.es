export function replacePathWithDot(str) {
	return str.replace(/^collector\.config/, '')
		.replace(/\.crawl\[/g, '')
		.replace(/\]$/, '')
		.replace(/\]/g, '.')
}
