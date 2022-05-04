import type {PrincipalKeyUser} from '@enonic/js-utils/src/types/Auth.d';
import type {TaskDescriptor} from '/lib/explorer/types/Task.d';
import type {AnyObject} from '/lib/explorer/types/Utility.d';


export interface ScheduledJob<Config extends AnyObject = AnyObject> {
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
