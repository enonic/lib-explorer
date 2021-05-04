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
    	nGram: true,
    	fulltext: true,
    	includeInAllText: true,
    	path: true
	}*/
	key
});
