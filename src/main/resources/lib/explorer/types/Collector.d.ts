import type {AnyObject} from '@enonic/js-utils/types';
import type { TaskStateType } from '/lib/xp/task';
import type {
	TaskName,
	TaskShouldType
} from './Task.d';

//──────────────────────────────────────────────────────────────────────────────
// Collector UI
//──────────────────────────────────────────────────────────────────────────────
export type CollectorComponentAfterResetFunction = () => void;

export type CollectorComponentValidateFunction<
	CollectorConfig extends AnyObject = AnyObject
> = (collectorConfig: CollectorConfig) => boolean

export type CollectorComponentImperativeHandle<
	CollectorConfig extends AnyObject = AnyObject
> = {
	afterReset: CollectorComponentAfterResetFunction
	validate: CollectorComponentValidateFunction<CollectorConfig>
};

export type CollectorComponentRef<
	CollectorConfig extends AnyObject = AnyObject
> = React.MutableRefObject<
	CollectorComponentImperativeHandle<
		CollectorConfig
	>
>

export type ContentTypeOptions = unknown[];

export type Fields = Record<string,{
	label: string
}>;

export type SiteOptions = Array<unknown>;

export type CollectorProps<
	CollectorConfig extends AnyObject = AnyObject
> = {
	collectorConfig: CollectorConfig
	explorer: {
		contentTypeOptions: ContentTypeOptions
		fields: Fields
		siteOptions: SiteOptions
	}
	initialCollectorConfig: CollectorConfig
	setCollectorConfig: React.Dispatch<React.SetStateAction<CollectorConfig>>
	setCollectorConfigErrorCount: React.Dispatch<React.SetStateAction<number>>
};

//──────────────────────────────────────────────────────────────────────────────
// Collector API
//──────────────────────────────────────────────────────────────────────────────

export type CollectorId = string


export type CollectorReactComponentParams = {
	context: {
		values: unknown
	}
	dispatch: () => void
	path: string
}

export interface CollectorsJsonCollector {
	appName: typeof app.name
	displayName: string
	taskName: TaskName // Used to be collectTaskName in register
	componentPath?: string // Replaced by formLibraryName
	configAssetPath?: string // Replaced by formAssetPath
	formAssetPath?: string
	formLibraryName?: string
}

export type Collector = {
	appName: typeof app.name
	componentPath: string
	configAssetPath: string
	displayName: string
	taskName: TaskName // Used to be collectTaskName in register
}


export interface CollectorStateData {
	should: TaskShouldType
	state: TaskStateType
}
