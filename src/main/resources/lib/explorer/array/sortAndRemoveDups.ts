// This implementation has been profiled. If you want to change it,
// duplicate it and profile old and new too see if your changes are faster...
export function sortAndRemoveDups<T>(arr :Array<T>) {
	const sorted = arr.sort();
	const uniq :Array<T> = [];
	let prev = null;
	for (let i = 0; i < sorted.length; i += 1) {
		if (sorted[i] !== prev) { uniq.push(sorted[i]); }
		prev = sorted[i];
	}
	return uniq;
}
