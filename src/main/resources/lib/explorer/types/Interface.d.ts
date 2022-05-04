import type {
	//NodeCreateParams,
	ParentPath,
	RequiredNodeProperties
} from '/lib/explorer/types/Node.d';
import type {OneOrMore} from '/lib/explorer/types/Utility.d';


export interface InterfaceField {
	name :string
	boost? :number
}

/*export type InterfaceCreate = Omit<NodeCreateParams,'_name'> & {
	_name :string
	collectionIds? :OneOrMore<string>
	//createdTime? :Date|string
	fields? :OneOrMore<InterfaceField>
	stopWords? :OneOrMore<string>
	synonymIds? :OneOrMore<string>
}*/

export type Interface = Omit<
	RequiredNodeProperties,
	'_childOrder'
	| '_nodeType'
	| '_indexConfig'
	| '_inheritsPermissions'
	| '_permissions'
	| '_state'
	| '_ts'
> & {
	collectionIds? :Array<string>
	fields? :Array<InterfaceField>
	//modifiedTime? :Date|string
	stopWords? :Array<string>
	synonymIds? :Array<string>
}

export type InterfaceNode = RequiredNodeProperties & {
	collectionIds? :OneOrMore<string>
	fields? :OneOrMore<InterfaceField>
	modifiedTime? :Date|string
	stopWords? :OneOrMore<string>
	synonymIds? :OneOrMore<string>
}

export interface InterfaceCreateParams extends InterfaceNode {
	_parentPath :ParentPath
}
