import test from 'ava';
import {wash} from '../src/main/resources/lib/enonic/yase/query/wash.es';
//import {stringify} from 'q-i';

[
	['.a.', 'a'],
	['.one +two.', 'one +two'],
	['.one |two.', 'one |two'],
	['.one -two.', 'one -two'],
	['.prefix*.', 'prefix*'],
	['.(precedence).', '(precedence)'],
	['."phrase".', '"phrase"'],
	['.fuzziness~1.', 'fuzziness~1'],
	['."slop"~1.', '"slop"~1'],
	['.æøå.', 'æøå'],
].forEach(([string, expected]) => test(`${string} => ${expected}`, t => {
	t.deepEqual(
		wash({string}),
		expected
	);
}));
