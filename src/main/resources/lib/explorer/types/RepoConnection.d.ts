export type { RepoConnection } from '@enonic-types/lib-node';


interface HighlightResponse {
	readonly [uuid: string]:
	| {
		[name: string]: ReadonlyArray<string>;
	}
	| undefined;
}

interface PushNodeParams {
	key?: string; // Id or path to the nodes // TODO Does this parameter even exist outside the docs?
	keys: string[]; // Array of ids or paths to the nodes
	target: string; // Branch to push to
	includeChildren?: boolean; // Also push children of given nodes. Default is false.
	resolve?: boolean; // Resolve dependencies before pushing, meaning that references will also be pushed. Default is true.
	/**
	* Optional array of ids or paths to nodes not to be pushed.
	* If using this, be aware that nodes need to maintain data integrity (e.g parents must be present in target).
	* If data integrity is not maintained with excluded nodes, they will be pushed anyway.
	*/
	exclude?: string[];
}

interface PushNodeResult {
	success: string[];
	failed: {
		id: string;
		reason: string;
	}[];
	deleted: string[];
}
