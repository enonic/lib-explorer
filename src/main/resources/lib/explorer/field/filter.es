export const filter = ({
	//_name,
	fieldType,
	indexConfig, // string or object
	key
}) => ({
	//_name,
	fieldType,
	indexConfig, /* type, minimal, none, fulltext, path, or {
		decideByType: true,
    	enabled: true,
    	nGram: true, // INDEX_CONFIG_N_GRAM
    	fulltext: true,
    	includeInAllText: true,
    	path: true
	}*/
	key
});
