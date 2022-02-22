import type {PrincipalKeyUser} from '/lib/explorer/types.d';
import type {TaskDescriptor} from '/lib/explorer/task/types.d';


export interface ScheduledJob<Config extends {} = {}> {
	config :Config
	creator :PrincipalKeyUser
	createdTime :Date|string
	enabled :boolean
	description :string
	descriptor :TaskDescriptor
	lastRun :Date|string
	lastTaskId :string
	modifier :PrincipalKeyUser
	modifiedTime :Date|string
	name :string
	schedule :{
		timeZone :string
		type :string
		value :string
	}
	user :string
}
