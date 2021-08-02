import {Node} from '/lib/explorer/model/2/nodeTypes/Node';

export interface FieldMapping {
	field: string,
	to: string,
	highlight: boolean,
	fragmenter?: string,
	lengthLimit?: number,
	numberOfFragments?: number,
	order?: string,
	postTag?: string,
	preTag?: string,
	type: string
}

export interface InterfaceNode extends Node {
	//displayName
}
