export const DEFAULT_FULLTEXT_PARAMS = {
	fields: [{
		field: '',
		boost: ''
	}],
	operator: 'or'
};

export const DEFAULT_FULLTEXT_EXPRESSION = {
	type: 'fulltext',
	params: DEFAULT_FULLTEXT_PARAMS
};

export const DEFAULT_GROUP_PARAMS = {
	expressions: [DEFAULT_FULLTEXT_EXPRESSION],
	operator: 'or'
};

export const DEFAULT_GROUP_EXPRESSION = {
	type: 'group',
	params: DEFAULT_GROUP_PARAMS
};
