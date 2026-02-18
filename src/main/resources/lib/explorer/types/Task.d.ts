import type { TaskInfo } from '/lib/xp/task';

export type TaskName = string;

export interface Task<InfoObj = Record<string, unknown>> extends TaskInfo {
	progress: {
		info: string; // might be json :)
		infoObj?: InfoObj; // Used in GraphQL as GraphQLJSON
		current: number;
		total: number;
	}
}

export type TaskDescriptor = `${typeof app.name}:${TaskName}`;

export interface TaskProgressParams<InfoObj extends Record<string, unknown> = {
	currentTime?: number;
	name?: string;
	message?: string;
	startTime?: number;
	uri?: string;
}> {
	current?: number;
	total?: number;
	info?: InfoObj;
}

export type TaskShouldType = 'RUN' | 'STOP';
