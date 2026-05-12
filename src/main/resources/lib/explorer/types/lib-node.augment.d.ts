// XP 8 dropped the `modify` method from RepoConnection's public TypeScript surface
// in favour of `update`, but the runtime still exposes `modify` as a deprecated
// alias (see XP core's `modules/lib/lib-node/src/main/resources/lib/xp/node.ts`).
// Re-declare it here so existing call sites keep type-checking while staying on
// the runtime-supported behaviour. Drop this augmentation once all call sites
// (and `@enonic/mock-xp`) move to `update`.
import type {
	ModifyNodeParams,
	Node,
} from '@enonic-types/lib-node';


declare module '@enonic-types/lib-node' {
	interface RepoConnection {
		/** @deprecated Use {@link RepoConnection.update} instead. */
		modify<NodeData = Record<string, unknown>>(params: ModifyNodeParams<NodeData>): Node<NodeData>;
	}
}
