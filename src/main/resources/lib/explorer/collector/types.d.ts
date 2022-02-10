import type {ApplicationKey} from '../../../globals.d';
import type {TaskName} from '../task/types.d';


export interface Collector {
	appName :ApplicationKey
	collectTaskName :TaskName
	componentPath :string
	configAssetPath :string
	displayName :string
}
