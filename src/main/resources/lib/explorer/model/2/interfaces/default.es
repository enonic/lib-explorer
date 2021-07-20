export const DEFAULT_INTERFACE_NAME = 'default';


export const DEFAULT_INTERFACE = {
	_name: DEFAULT_INTERFACE_NAME,

	// NOTE: _parentPath is a parameter when creating a node, used in _path
	// Since it is not stored it creates diffing issues...
	//_parentPath: `/${INTERFACES_FOLDER}`,

	//collections: [], // Enonic XP cannot store empty arrays, avoid diffing issue.

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
								boost: 4
							},{
								field: 'uri',
								boost: 4
							},{
								field: 'text',
								boost: 4
							}
						],
						operator: 'and'
					}
				},{
					type: 'stemmed',
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
						language: 'no',
						operator: 'and'
					}
				},{
					type: 'stemmed',
					params: {
						fields: [
							{
								field: 'title',
								boost: 2
							},{
								field: 'uri',
								boost: 2
							},{
								field: 'text',
								boost: 2
							}
						],
						language: 'en',
						operator: 'and'
					}
				}, {
					type: 'ngram',
					params: {
						fields: [
							{
								field: 'title',
								boost: 1
							},{
								field: 'text',
								boost: 1
							}
						],
						operator: 'and'
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
			}
		]
	}
};
