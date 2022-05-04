import type {
	ExplorerAdminGQLInterfaceNodeCommonProps,
	Node,
	NodeCreate
} from '/lib/explorer/types/Node.d';
import type {OneOrMore} from '/lib/explorer/types/Utility.d';


export type InterfaceField = {
	name :string
	boost? :number
}

export type InterfaceNodeSpecific = {
	collectionIds ?:OneOrMore<string>
	fields ?:OneOrMore<InterfaceField>
	modifiedTime ?:Date|string
	stopWords ?:OneOrMore<string>
	synonymIds ?:OneOrMore<string>
}

export type InterfaceNode = Node<InterfaceNodeSpecific>

export type InterfaceNodeCreateParams = NodeCreate<InterfaceNodeSpecific>

export type InterfaceSpecific = {
	collectionIds? :Array<string>
	fields? :Array<InterfaceField>
	stopWords? :Array<string>
	synonymIds? :Array<string>
}

export type Interface = ExplorerAdminGQLInterfaceNodeCommonProps<
	InterfaceSpecific
>
