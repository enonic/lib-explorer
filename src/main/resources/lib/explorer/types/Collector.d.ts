import type {Application} from '../../../index.d';
import type {TaskName} from '../task/types.d';


export interface Collector {
	appName :Application.Key
	collectTaskName :TaskName
	componentPath :string
	configAssetPath :string
	displayName :string
}
