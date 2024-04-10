import {
	describe,
	expect,
	// jest,
	test as it
} from '@jest/globals';
// import {Log} from '@enonic/mock-xp';
import {makeQuery} from './makeQuery';

// const logger = Log.createLogger({
// 	loglevel: 'debug'
// });

describe('makeQuery', () => {
	it('should make a minimal query for minimal input', () => {
		expect(makeQuery({
			fields: [],
			searchStringWithoutStopWords: 'god',
		})).toEqual({
			boolean: {
				should: [{
					fulltext: {
						fields: ['_alltext'],
						operator: 'AND',
						query: 'god',
					}
				}, {
					ngram: {
						boost: 0.8,
						fields: ['_alltext'],
						operator: 'AND',
						query: 'god',
					}
				}]
			}
		});
	});

	it('should handle field boosting', () => {
		expect(makeQuery({
			fields: [{
				boost: 1.1,
				name: 'title',
			}],
			searchStringWithoutStopWords: 'god',
		})).toEqual({
			boolean: {
				should: [{
					boolean: {
						should: [{
							fulltext: {
								boost: 1.1,
								fields: ['title'],
								operator: 'AND',
								query: 'god'
							}
						}, {
							fulltext: {
								fields: ['_alltext'],
								operator: 'AND',
								query: 'god'
							}
						}]
					}
				},{
					boolean: {
						should: [{
							ngram: {
								boost: 0.8800000000000001,
								fields: ['title'],
								operator: 'AND',
								query: 'god'
							}
						}, {
							ngram: {
								boost: 0.8,
								fields: ['_alltext'],
								operator: 'AND',
								query: 'god'
							}
						}]
					}
				}]
			}
		});
	});

	it('should handle stemming', () => {
		expect(makeQuery({
			fields: [],
			searchStringWithoutStopWords: 'god',
			stemmingLanguages: ['no', 'en'],
		})).toEqual({
			boolean: {
				should: [{
					fulltext: {
						fields: ['_alltext'],
						operator: 'AND',
						query: 'god'
					}
				}, {
					stemmed: {
						boost: 0.9,
						fields: ['_alltext'],
						language: 'no',
						operator: 'AND',
						query: 'god'
					}
				}, {
					stemmed: {
						boost: 0.9,
						fields: ['_alltext'],
						language: 'en',
						operator: 'AND',
						query: 'god'
					}
				}, {
					ngram: {
						boost: 0.8,
						fields: ['_alltext'],
						operator: 'AND',
						query: 'god'
					}
				}]
			}
		});
	});

	it('should handle term boosting', () => {
		const res = makeQuery({
			fields: [],
			searchStringWithoutStopWords: 'god',
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
			}]
		});
		// logger.debug('res:%s', res);
		const mainQuery = {
			boolean: {
				should: [{
					fulltext: {
						fields: ['_alltext'],
						operator: 'AND',
						query: 'god'
					}
				}, {
					ngram: {
						boost: 0.8,
						fields: ['_alltext'],
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
		const termQuery = {
			boolean: {
				should: termQueries
			}
		};
		expect(res).toEqual({
			boolean: {
				should: [
					mainQuery,
					{
						boolean: {
							must: [
								mainQuery,
								termQuery
							]
						}
					}
				]
			}
		});
	});

	it('should handle everything all at once', () => {
		const res = makeQuery({
			fields: [{
				boost: 1.1,
				name: 'title',
			}],
			searchStringWithoutStopWords: 'god',
			stemmingLanguages: ['no', 'en'],
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
			}]
		});
		// logger.debug('res:%s', res);
		const mainQuery = {
			boolean: {
				should: [{
					boolean: {
						should: [{
							fulltext: {
								boost: 1.1,
								fields: ['title'],
								operator: 'AND',
								query: 'god'
							}
						}, {
							fulltext: {
								fields: ['_alltext'],
								operator: 'AND',
								query: 'god'
							}
						}] // nested should
					} // nested boolean
				}, {
					boolean: {
						should: [{
							stemmed: {
								boost: 0.9900000000000001,
								fields: ['title'],
								language: 'no',
								operator: 'AND',
								query: 'god'
							}
						}, {
							stemmed: {
								boost: 0.9,
								fields: ['_alltext'],
								language: 'no',
								operator: 'AND',
								query: 'god'
							}
						}]
					}
				}, {
					boolean: {
						should: [{
							stemmed: {
								boost: 0.9900000000000001,
								fields: ['title'],
								language: 'en',
								operator: 'AND',
								query: 'god'
							}
						}, {
							stemmed: {
								boost: 0.9,
								fields: ['_alltext'],
								language: 'en',
								operator: 'AND',
								query: 'god'
							}
						}]
					}
				}, {
					boolean: {
						should: [{
							ngram: {
								boost: 0.8800000000000001,
								fields: ['title'],
								operator: 'AND',
								query: 'god'
							}
						}, {
							ngram: {
								boost: 0.8,
								fields: ['_alltext'],
								operator: 'AND',
								query: 'god'
							}
						}]
					}
				}]
			}
		}
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
		const termQuery = {
			boolean: {
				should: termQueries
			}
		};
		expect(res).toEqual({
			boolean: {
				should: [
					mainQuery,
					{
						boolean: {
							must: [
								mainQuery,
								termQuery
							]
						}
					}
				]
			}
		});
	}); // it
}); // describe makeQuery
