import type {Application} from '../../../index.d';
import type {TaskName} from './Task.d';


export interface Collector {
	appName :Application.Key
	collectTaskName :TaskName
	componentPath :string
	configAssetPath :string
	displayName :string
}
