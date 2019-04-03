import test from 'ava';
import {replaceSyntax} from '../src/main/resources/lib/enonic/yase/query/replaceSyntax.es';


[
	['one +two', 'one two'],
	['one |two', 'one two'],
	['one -two', 'one two'],
	['prefix*', 'prefix'],
	['(precedence)', 'precedence'],
	['"phrase"', 'phrase'],
	['fuzziness~123', 'fuzziness'],
	['"slop"~123', 'slop'],
	['æøå', 'æøå'],
].forEach(([string, expected]) => test(`${string} => ${expected}`, t => {
	t.deepEqual(
		replaceSyntax({string, replacement:''}),
		expected
	);
}));
