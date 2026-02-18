import type {
	CreateNodeParams,
	Node
} from '/lib/xp/node';
import type {
	ExplorerAdminGQLInterfaceNodeCommonProps,
	// Node,
} from './Node.d';


export type NotificationsNodeSpecific = {
	emails?: string[];
}

export type NotificationsNodeCreateParams = CreateNodeParams<NotificationsNodeSpecific>

export type NotificationsNode = Node<NotificationsNodeSpecific>;

export type Notifications = ExplorerAdminGQLInterfaceNodeCommonProps<
	NotificationsNodeSpecific
>
