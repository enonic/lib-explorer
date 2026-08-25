import type {
	Log,
	LibNode,
} from '@enonic/mock-xp';
import type { SynonymsArray } from '../../../synonym';
import type { Java } from '../../../../../../../jest/types';

import {
	describe,
	expect,
	// jest,
	test as it
} from '@jest/globals';
import {
	BRANCH_ID_EXPLORER,
	PRINCIPAL_EXPLORER_READ,
	REPO_ID_EXPLORER
} from '../../../constants';
import { makeQueryAndSynonyms } from './makeQueryAndSynonyms';


declare namespace globalThis {
	let log: Log;
	let libNode: LibNode;
	let Java: Java;
}


const TEST_INTERFACE_ID = 'test_interface';
const TEST_LANGUAGES = ['no'];
const TEST_LOCALES_IN_SELECTED_THESAURI = ['no'];
const TEST_SYNONYMS_SOURCE: SynonymsArray = [];
const TEST_THESAURI_NAMES: string[] = [];

const explorerRepoReadConnection = globalThis.libNode.connect({
	branch: BRANCH_ID_EXPLORER,
	repoId: REPO_ID_EXPLORER,
	principals: [PRINCIPAL_EXPLORER_READ],
	// user: {}
});


describe('makeQuery', () => {
	it('should make a minimal query for minimal input', () => {
		const actual = makeQueryAndSynonyms({
			// _trace: true,
			explorerRepoReadConnection,
			fields: [],
			interfaceId: TEST_INTERFACE_ID,
			languages: TEST_LANGUAGES,
			localesInSelectedThesauri: TEST_LOCALES_IN_SELECTED_THESAURI,
			searchStringWithoutStopWords: 'god',
			synonymsSource: TEST_SYNONYMS_SOURCE,
			thesauriNames: TEST_THESAURI_NAMES,
		});
		expect(actual.query).toEqual({
			boolean: {
				should: [{
					fulltext: {
						boost: 1,
						fields: ['_alltext^1'],
						operator: 'AND',
						query: 'god',
					}
				}, {
					ngram: {
						boost: 0.8,
						fields: ['_alltext^1'],
						operator: 'AND',
						query: 'god',
					}
				}]
			}
		});
	});

	it('should handle field boosting', () => {
		const actual = makeQueryAndSynonyms({
			explorerRepoReadConnection,
			fields: [{
				boost: 1.1,
				name: 'title',
			}],
			interfaceId: TEST_INTERFACE_ID,
			languages: TEST_LANGUAGES,
			localesInSelectedThesauri: TEST_LOCALES_IN_SELECTED_THESAURI,
			searchStringWithoutStopWords: 'god',
			synonymsSource: TEST_SYNONYMS_SOURCE,
			thesauriNames: TEST_THESAURI_NAMES,
		});
		// log.debug('actual:%s', actual);
		const expected = {
			boolean: {
				should: [{
					fulltext: {
						boost: 1,
						fields: ['title^1.1', '_alltext^1'],
						operator: 'AND',
						query: 'god'
					}
				}, {
					ngram: {
						boost: 0.8,
						fields: ['title^1.1', '_alltext^1'],
						operator: 'AND',
						query: 'god'
					}
				}]
			}
		};
		expect(actual.query).toEqual(expected);
	});

	it('should handle stemming', () => {
		const actual = makeQueryAndSynonyms({
			explorerRepoReadConnection,
			fields: [],
			interfaceId: TEST_INTERFACE_ID,
			languages: TEST_LANGUAGES,
			localesInSelectedThesauri: TEST_LOCALES_IN_SELECTED_THESAURI,
			searchStringWithoutStopWords: 'god',
			stemmingLanguages: ['no', 'en'],
			synonymsSource: TEST_SYNONYMS_SOURCE,
			thesauriNames: TEST_THESAURI_NAMES,
		});
		// log.debug('actual:%s', actual);
		expect(actual.query).toEqual({
			boolean: {
				should: [{
					fulltext: {
						boost: 1,
						fields: ['_alltext^1'],
						operator: 'AND',
						query: 'god'
					}
				}, {
					stemmed: {
						boost: 0.9,
						fields: ['_alltext^1'],
						language: 'no',
						operator: 'AND',
						query: 'god'
					}
				}, {
					stemmed: {
						boost: 0.9,
						fields: ['_alltext^1'],
						language: 'en',
						operator: 'AND',
						query: 'god'
					}
				}, {
					ngram: {
						boost: 0.8,
						fields: ['_alltext^1'],
						operator: 'AND',
						query: 'god'
					}
				}]
			}
		});
	});

	it('should handle term boosting', () => {
		const actual = makeQueryAndSynonyms({
			explorerRepoReadConnection,
			fields: [],
			interfaceId: TEST_INTERFACE_ID,
			languages: TEST_LANGUAGES,
			localesInSelectedThesauri: TEST_LOCALES_IN_SELECTED_THESAURI,
			searchStringWithoutStopWords: 'god',
			synonymsSource: TEST_SYNONYMS_SOURCE,
			termQueries: [{
				boost: 1.2,
				field: 'divine',
				booleanValue: true,
				type: 'boolean'
			}, {
				boost: 1.3,
				field: 'verse',
				doubleValue: 3.16,
				type: 'double'
			}, {
				boost: 1.4,
				field: 'age',
				longValue: 33,
				type: 'long'
			}, {
				boost: 1.5,
				field: 'name',
				stringValue: 'Jesus',
				type: 'string'
			}],
			thesauriNames: TEST_THESAURI_NAMES,
		});
		// log.debug('actual:%s', actual);
		const mainQuery = {
			boolean: {
				should: [{
					fulltext: {
						boost: 1,
						fields: ['_alltext^1'],
						operator: 'AND',
						query: 'god'
					}
				}, {
					ngram: {
						boost: 0.8,
						fields: ['_alltext^1'],
						operator: 'AND',
						query: 'god'
					}
				}]
			}
		};
		const termQueries = [{
			term: {
				boost: 1.2,
				field: 'divine',
				value: true
			}
		}, {
			term: {
				boost: 1.3,
				field: 'verse',
				value: 3.16
			}
		}, {
			term: {
				boost: 1.4,
				field: 'age',
				value: 33
			}
		}, {
			term: {
				boost: 1.5,
				field: 'name',
				value: 'Jesus'
			}
		}];
		expect(actual.query).toEqual({
			boolean: {
				must: mainQuery,
				should: termQueries
			}
		});
	});

	it('should handle everything all at once', () => {
		const actual = makeQueryAndSynonyms({
			explorerRepoReadConnection,
			fields: [{
				boost: 1.1,
				name: 'title',
			}],
			interfaceId: TEST_INTERFACE_ID,
			languages: TEST_LANGUAGES,
			localesInSelectedThesauri: TEST_LOCALES_IN_SELECTED_THESAURI,
			searchStringWithoutStopWords: 'god',
			stemmingLanguages: ['no', 'en'],
			synonymsSource: TEST_SYNONYMS_SOURCE,
			termQueries: [{
				boost: 1.2,
				field: 'divine',
				booleanValue: true,
				type: 'boolean'
			}, {
				boost: 1.3,
				field: 'verse',
				doubleValue: 3.16,
				type: 'double'
			}, {
				boost: 1.4,
				field: 'age',
				longValue: 33,
				type: 'long'
			}, {
				boost: 1.5,
				field: 'name',
				stringValue: 'Jesus',
				type: 'string'
			}],
			thesauriNames: TEST_THESAURI_NAMES,
		});
		// log.debug('actual:%s', actual);
		const mainQuery = {
			boolean: {
				should: [{
					fulltext: {
						boost: 1,
						fields: ['title^1.1', '_alltext^1'],
						operator: 'AND',
						query: 'god'
					}
				}, {
					stemmed: {
						boost: 0.9,
						fields: ['title^1.1', '_alltext^1'],
						language: 'no',
						operator: 'AND',
						query: 'god'
					}
				}, {
					stemmed: {
						boost: 0.9,
						fields: ['title^1.1','_alltext^1'],
						language: 'en',
						operator: 'AND',
						query: 'god'
					}
				}, {
					ngram: {
						boost: 0.8,
						fields: ['title^1.1', '_alltext^1'],
						operator: 'AND',
						query: 'god'
					}
				}]
			}
		};
		const termQueries = [{
			term: {
				boost: 1.2,
				field: 'divine',
				value: true
			}
		}, {
			term: {
				boost: 1.3,
				field: 'verse',
				value: 3.16
			}
		}, {
			term: {
				boost: 1.4,
				field: 'age',
				value: 33
			}
		}, {
			term: {
				boost: 1.5,
				field: 'name',
				value: 'Jesus'
			}
		}];
		expect(actual.query).toEqual({
			boolean: {
				must: mainQuery,
				should: termQueries
			}
		});
	}); // it
}); // describe makeQuery
