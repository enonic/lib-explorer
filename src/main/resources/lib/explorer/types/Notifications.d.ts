import type {
	ExplorerAdminGQLInterfaceNodeCommonProps,
	Node,
	NodeCreate
} from './Node.d';


export type NotificationsNodeSpecific = {
	emails ?:Array<string>
}

export type NotificationsNodeCreateParams = NodeCreate<NotificationsNodeSpecific>

export type NotificationsNode = Node<NotificationsNodeSpecific>;

export type Notifications = ExplorerAdminGQLInterfaceNodeCommonProps<
	NotificationsNodeSpecific
>
