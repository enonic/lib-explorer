import test from 'ava';
import {highlight} from '../src/main/resources/lib/enonic/yase/highlight.es';
//import {stringify} from 'q-i';

[
	['what ever', 'what', '*WHAT* ever'],
	['a b c', 'a | b', '*A* *B* c'],
].forEach(([string, query ,expected]) => test(`highlight(${string}, ${query}) => ${expected}`, t => {
	t.deepEqual(
		highlight(string, query, 255),
		expected
	);
}));
