import test from 'ava';
import {mapSynonyms} from '../src/main/resources/lib/enonic/yase/search/mapSynonyms.es';
//import {stringify} from 'q-i';

[
	{
		searchString: '',
		expand: false,
		from: ['a', 'b'],
		to: ['C', 'd'],
		expected: null
	}, {
		searchString: 'A',
		expand: false,
		from: ['a', 'b'],
		to: ['C', 'd'],
		expected: {
			from: ['a'],
			to: ['C', 'd']
		}
	}, {
		searchString: 'a b c d',
		expand: false,
		from: ['a', 'b'],
		to: ['c', 'd'],
		expected: null
	}, {
		searchString: 'a b c d',
		expand: true,
		from: ['a', 'b'],
		to: ['c', 'd'],
		expected: null
	}, {
		searchString: 'a',
		expand: false,
		from: ['a', 'b'],
		to: ['c', 'd'],
		expected: {
			from: ['a'],
			to: ['c', 'd']
		}
	}, {
		searchString: 'a',
		expand: true,
		from: ['a', 'b'],
		to: ['c', 'd'],
		expected: {
			from: ['a'],
			to: ['b', 'c', 'd']
		}
	}, {
		searchString: 'b',
		expand: false,
		from: ['a', 'b'],
		to: ['c', 'd'],
		expected: {
			from: ['b'],
			to: ['c', 'd']
		}
	}, {
		searchString: 'b',
		expand: true,
		from: ['a', 'b'],
		to: ['c', 'd'],
		expected: {
			from: ['b'],
			to: ['a', 'c', 'd']
		}
	}, {
		searchString: 'c',
		expand: false,
		from: ['a', 'b'],
		to: ['c', 'd'],
		expected: null
	}, {
		searchString: 'c',
		expand: true,
		from: ['a', 'b'],
		to: ['c', 'd'],
		expected: {
			from: ['c'],
			to: ['a', 'b', 'd']
		}
	}, {
		searchString: 'd',
		expand: false,
		from: ['a', 'b'],
		to: ['c', 'd'],
		expected: null
	}, {
		searchString: 'd',
		expand: true,
		from: ['a', 'b'],
		to: ['c', 'd'],
		expected: {
			from: ['d'],
			to: ['a', 'b', 'c']
		}
	}
].forEach(({
	expand,
	expected,
	from,
	searchString,
	to
}) => test(`mapSynonyms({searchString: ${searchString}, expand: ${expand}, from: ${from}, to: ${to}}) => ${JSON.stringify(expected)}`, t => {
	t.deepEqual(
		mapSynonyms({
			expand,
			from,
			searchString,
			to
		}),
		expected
	);
}));
