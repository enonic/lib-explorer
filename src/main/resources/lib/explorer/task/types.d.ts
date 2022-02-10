import type {Application} from '../../../index.d';


export type TaskName = string;

export interface Task {
	description :string
    id :string
    name :string // TaskName
    state :string
    application :string // ApplicationKey
    user :string
    startTime :string
    progress: {
      info :string
      current :number
      total :number
    }
}

export type TaskDescriptor = `${Application.Key}:${TaskName}`;
