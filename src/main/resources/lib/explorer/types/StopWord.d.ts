import type {RequiredNodeProperties} from '/lib/explorer/types.d';


export interface StopwordNodeSpecific {
	words? :Array<string>|string
}

export type StopwordNode = RequiredNodeProperties & StopwordNodeSpecific;

export type Stopword = Omit<
	RequiredNodeProperties,
	'_childOrder'
		//| '_id' // Needed for common GraphQL Interface Node
		| '_indexConfig'
		| '_inheritsPermissions'
		//| '_name' // Needed for common GraphQL Interface Node
		//| '_nodeType' // Needed for common GraphQL Interface Node
		//| '_path' // Needed for common GraphQL Interface Node
		| '_permissions'
		| '_state'
		| '_ts'
		//| '_versionKey' // Needed for common GraphQL Interface Node
> & Omit<StopwordNodeSpecific, 'words'> & {
	words :Array<string>
}

export interface QueriedStopword extends Stopword {
	/*_highlight? :{
		[name: string]: ReadonlyArray<string>;
	}*/
	_score :number
}
