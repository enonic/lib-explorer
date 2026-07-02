import { hasOperator } from './hasOperator';

export function quoteWordsWithNumbers(searchString: string): string {
	if (!searchString || hasOperator(searchString)) return searchString;

	return searchString
		.split(/\s+/)
		.map((word) => {
			// Only wrap words that contain at least one digit
			if (/\d/.test(word)) return `"${word}"`;
			return word;
		})
		.join(' ')
}
