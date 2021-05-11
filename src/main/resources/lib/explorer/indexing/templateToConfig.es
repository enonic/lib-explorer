const isObject = (value) => Object.prototype.toString.call(value).slice(8,-1) === 'Object';

export function templateToConfig({
	template,
	indexValueProcessors,// = [],
	languages// = []
}) {
	if (isObject(template)) {
		template.indexValueProcessors = indexValueProcessors;
		template.languages = languages;
		return template;
	}
	if (template === 'none') {
		return {
			enabled: false,
			decideByType: false,
			nGram: false,
			fulltext: false,
			includeInAllText: false,
			path: false,
			indexValueProcessors,
			languages
		};
	}
	if (template === 'byType') {
		return {
			enabled: true,
			decideByType: true,
			nGram: false,
			fulltext: false,
			includeInAllText: false,
			path: false,
			indexValueProcessors,
			languages
		};
	}
	if (template === 'fulltext') {
		return {
			enabled: true,
			decideByType: false,
			nGram: true,
			fulltext: true,
			includeInAllText: true,
			path: false,
			indexValueProcessors,
			languages
		};
	}
	if (template === 'path') {
		return {
			enabled: true,
			decideByType: false,
			nGram: false,
			fulltext: false,
			includeInAllText: false,
			path: true,
			indexValueProcessors,
			languages
		};
	}
	if (template === 'minimal') {
		return {
			enabled: true,
			decideByType: false,
			nGram: false,
			fulltext: false,
			includeInAllText: false,
			path: false,
			indexValueProcessors,
			languages
		};
	}
	throw new Error(`Unknown indexing template:${template}!`);
}
