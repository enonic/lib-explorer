import type {
	Node,
} from '/lib/xp/node';
import type {
	NodeCreate
} from '@enonic-types/lib-explorer/Node.d';


/*export type ThesaurusLanguage = {
	from :string
	to :string
}*/

export interface ThesaurusSpecific {
	description ?:string
	allowedLanguages ?:Array<string> // Optional for backwards compatibility with exisiting Thesauri.
	//language? :string
	//language :ThesaurusLanguage
}

export type ThesaurusNode = Node<ThesaurusSpecific>;

export type ThesaurusNodeCreateParams = NodeCreate<ThesaurusSpecific>;

export type Thesaurus = Omit<
	ThesaurusNode,
	'_childOrder'
		| '_indexConfig'
		| '_inheritsPermissions'
		| '_manualOrderValue' // TODO: The Node Generic should make this optional
		//| '_nodeType' // GraphQL Interface Node needs this
		| '_parentPath' // TODO: The Node Generic should not have this
		| '_permissions'
		| '_state'
		| '_ts'
		//| '_versionKey' // GraphQL Interface Node needs this
> & {
	synonymsCount? :number
}
