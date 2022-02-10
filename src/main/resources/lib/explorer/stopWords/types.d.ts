import type {RequiredNodeProperties} from '/lib/explorer/types.d';


export interface StopwordNodeSpecific {
	words? :Array<string>|string
}

export type StopwordNode = RequiredNodeProperties & StopwordNodeSpecific;

export type Stopword = Omit<
	RequiredNodeProperties,
	'_childOrder'
		| '_id'
		| '_indexConfig'
		| '_inheritsPermissions'
		| '_name' // Name is random and useless...
		| '_nodeType'
		//| '_path'
		| '_permissions'
		| '_state'
		| '_ts'
		| '_versionKey'
> & Omit<StopwordNodeSpecific, 'words'> & {
	id :string // TODO This is not present in the node, and should be removed
	name :string // TODO This is not present in the node, and should be removed
	words :Array<string>
}

export interface QueriedStopword extends Stopword {
	/*_highlight? :{
		[name: string]: ReadonlyArray<string>;
	}*/
	score :number // TODO rename _score
}
