import type {CreateNodeParams, Node} from '/lib/xp/node';
import type {Instant} from '/lib/xp/value';
import type {Explorer} from './Application.d';
import type {ExplorerAdminGQLInterfaceNodeCommonProps} from './Node.d';

export interface JournalMessage {
	message: string
}

export interface JournalInterface {
	// Required
	name: string
	startTime: number
	// Optional
	errors?: JournalMessage[]
	informations?: JournalMessage[]
	successes?: JournalMessage[]
	warnings?: JournalMessage[]
}

export type JournalNodeSpecific = {
	// Required
	duration: number // Calculated
	endTime: string|Date|Instant
	name: string
	startTime: string|Date|Instant
	// Optional
	errors?: JournalMessage[] // For example 500 Internal Server Error
	errorCount?: number // Calculated or 0
	informations?: JournalMessage[] // For example NOFOLLOW, NOINDEX // or application/pdf is not html
	successCount?: number // Calculated or 0
	successes?: JournalMessage[] // For example 200 Ok // or Document deleted successfully
	warningCount?: number // Calculated or 0
	warnings?: JournalMessage[] // For example 404 Not Found
}

export type JournalNode = Node<JournalNodeSpecific>;
export type JournalType = ExplorerAdminGQLInterfaceNodeCommonProps<JournalNodeSpecific>

export type CreateJournalNodeParams = CreateNodeParams<JournalNodeSpecific> & {
	_nodeType: `${Explorer.Application.Name}:journal`
};
