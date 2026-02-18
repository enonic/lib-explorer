import type { Reference } from '@enonic-types/lib-value';
import type {
	TermDslExpression,
	// InDslExpression,
	// LikeDslExpression,
	// RangeDslExpression,
	// PathMatchDslExpression,
	// ExistsDslExpression,
} from '/lib/xp/node';
import type {
	ExplorerAdminGQLInterfaceNodeCommonProps,
	Node,
	NodeCreate
} from './Node.d';
import type {OneOrMore} from './Utility.d';


import {
	VALUE_TYPE_BOOLEAN,
	VALUE_TYPE_DOUBLE,
	VALUE_TYPE_LONG,
	VALUE_TYPE_STRING,
} from '@enonic/js-utils';

export type InterfaceField = {
	name:string
	boost?: number
}

export type TermQuery = {
	boost?: TermDslExpression['boost']
	field?: TermDslExpression['field']
	type?:
		| typeof VALUE_TYPE_BOOLEAN
		| typeof VALUE_TYPE_DOUBLE
		| typeof VALUE_TYPE_LONG
		// | 'number' // covers VALUE_TYPE_DOUBLE and VALUE_TYPE_LONG
		| typeof VALUE_TYPE_STRING
	booleanValue?: boolean
	doubleValue?: number
	longValue?: number
	stringValue?: string

}

export type InterfaceNodeSpecific = {
	collectionIds?: OneOrMore<string|Reference>
	fields?: OneOrMore<InterfaceField>
	modifiedTime?: Date|string
	stopWords?: OneOrMore<string>
	synonymIds?: OneOrMore<string|Reference>
	termQueries?: OneOrMore<TermQuery>
}

export type InterfaceNode = Node<InterfaceNodeSpecific>

export type InterfaceNodeCreateParams = NodeCreate<InterfaceNodeSpecific>

export type InterfaceSpecific = {
	collectionIds?: (string|Reference)[]
	fields?: InterfaceField[]
	stopWords?: string[]
	synonymIds?: (string|Reference)[]
	termQueries?: TermQuery[]
}

export type Interface = ExplorerAdminGQLInterfaceNodeCommonProps<
	InterfaceSpecific
>
