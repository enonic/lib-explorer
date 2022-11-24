//──────────────────────────────────────────────────────────────────────────────
// Everything is simply backwards compatibility: TODO should be removed in 5.x?
//──────────────────────────────────────────────────────────────────────────────
import type {IterableElement} from 'type-fest';
import type {
	NodeIndexConfig,
	NodeConfigEntry,
	NodeIndexConfigTemplates
} from '/lib/xp/node';


export type {
	NodeConfigEntry as IndexConfigObject,
	NodeIndexConfigParams as IndexConfig,
	NodeIndexConfigTemplates as IndexConfigTemplate
} from '/lib/xp/node';

export type IndexConfigConfig = NodeConfigEntry | NodeIndexConfigTemplates

export type IndexConfigConfigsEntry = IterableElement<NodeIndexConfig['configs']>
