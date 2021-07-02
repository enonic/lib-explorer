import {indexTemplateToConfig} from '@enonic/js-utils';


export function templateToConfig({
	template,
	indexValueProcessors,
	languages
}) {
	log.warning('/lib/explorer/indexing/templateToConfig is DEPRECATED, use @enonic/js-utils/indexTemplateToConfig instead!');
	return indexTemplateToConfig({
		template,
		indexValueProcessors,
		languages
	});
}
