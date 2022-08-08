import type {
	ExplorerAdminGQLInterfaceNodeCommonProps,
	Node
} from './Node.d';


export type JournalError = {
	message :string
};


export type JournalSuccess = {
	message :string // For example 'deleted'
};


export type Journal = {
	name :string
	startTime :number
	errors :Array<JournalError>
	successes :Array<JournalSuccess>
}

export type JournalNodeSpecific = {
	displayName :string
	endTime :string|Date
	errors :Array<JournalError>
	errorCount :number
	duration :number
	name :string
	startTime :string|Date
	successCount :number
	successes :Array<JournalSuccess>
}

export type JournalNode = Node<JournalNodeSpecific>;
export type JournalType = ExplorerAdminGQLInterfaceNodeCommonProps<JournalNodeSpecific>
