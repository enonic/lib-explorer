import type {TaskInfo} from '/lib/xp/task';
import type {AnyObject} from '@enonic/js-utils/src/types';


export type TaskName = string;

export interface Task<InfoObj = AnyObject> extends TaskInfo {
	progress: {
		info :string // might be json :)
		infoObj ?:InfoObj // Used in GraphQL as GraphQLJSON
		current :number
		total :number
	}
}

export type TaskDescriptor = `${typeof app.name}:${TaskName}`;
