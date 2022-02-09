//@ts-ignore
import {run} from '/lib/xp/context';


export function runAsSu<ReturnValue>(fn :() => ReturnValue, {
	branch = 'master',
	repository = 'system-repo'
} :{
	branch? :string
	repository? :string
} = {}) :ReturnValue {
	return run({
		branch,
		repository,
		user: {
			login: 'su',
			idProvider: 'system'
		},
		principals: ['role:system.admin']
	}, () => fn());
}
