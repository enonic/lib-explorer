import type {Application} from '../../../index.d';
import type {AnyObject} from './Utility';


export type TaskName = string;

export interface Task<InfoObj = AnyObject> {
	description :string
	id :string
	name :string // TaskName
	state :string
	application :string // ApplicationKey
	user :string
	startTime :string
	progress: {
		info :string // might be json :)
		infoObj ?:InfoObj // Used in GraphQL as GraphQLJSON
		current :number
		total :number
	}
}

export type TaskDescriptor = `${Application.Key}:${TaskName}`;
