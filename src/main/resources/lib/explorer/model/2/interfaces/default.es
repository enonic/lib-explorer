import {NT_DOCUMENT} from '/lib/explorer/model/2/constants';


export const DEFAULT_INTERFACE = {
	_name: 'default',
	collections: [],
	displayName: 'Default',
	query: {
		type: 'group',
		params: {
			expressions: [
				{
					type: 'fulltext',
					params: {
						fields: [
							{
								field: 'title',
								boost: 3
							},{
								field: 'uri',
								boost: 3
							},{
								field: 'text',
								boost: 3
							}
						],
						operator: 'and'
					}
				},{
					type: 'ngram',
					params: {
						fields: [
							{
								field: 'title',
								boost: 2
							},{
								field: 'text',
								boost: 2
							}
						],
						operator: 'and',
						searchString: 'searchString'
					}
				}
			],
			operator: 'or'
		}
	},
	resultMappings: [
		{
			field: 'title',
			to: 'title',
			highlight: true,
			fragmenter: 'span',
			lengthLimit: 255,
			numberOfFragments: 1,
			order: 'none',
			postTag: '</b>',
			preTag: '<b>',
			type: 'string'
		},{
			field: 'text',
			highlight: true,
			fragmenter: 'span',
			lengthLimit: 255,
			numberOfFragments: 1,
			order: 'none',
			postTag: '</b>',
			preTag: '<b>',
			to: 'text',
			type: 'string'
		},{
			field: 'uri',
			highlight: false,
			//fragmenter: undefined,
			//lengthLimit: undefined,
			//order: undefined,
			//postTag: undefined,
			//preTag: undefined,
			to: 'href',
			type: 'string'
		}
	],
	/*pagination: {
		pagesToShow: 10,
		first: true,
		prev: true,
		next: true,
		last: true,
		firstPhrase: 'pagination.first',
		prevPhrase: 'pagination.prev',
		nextPhrase: 'pagination.next',
		lastPhrase: 'pagination.last'
	},*/
	filters: {
		must: [
			{
				filter: 'exists',
				params: {
					field: 'title'
				}
			}, {
				filter: 'exists',
				params: {
					field: 'uri'
				}
			},{
				filter: 'hasValue',
				params: {
					field: 'type',
					values: NT_DOCUMENT
				}
			}

		]
	}
};
