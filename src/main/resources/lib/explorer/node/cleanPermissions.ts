import type { PrincipalKey } from '@enonic-types/lib-auth';
import type {
	Node,
	AccessControlEntry
} from '@enonic-types/lib-node';


import {
	ROOT_PERMISSIONS_EXPLORER,
	Principal,
} from '@enonic/explorer-utils';
import { includes as arrayIncludes } from '@enonic/js-utils/array/includes';
import { toStr } from '@enonic/js-utils/value/toStr';


export default function cleanPermissions({
	_permissions = [],
	node,
}: {
	_permissions: AccessControlEntry[]
	node: Record<string, unknown>
}): AccessControlEntry[] {
	const safePermissions = [...ROOT_PERMISSIONS_EXPLORER]; // deref
	if (!Array.isArray(_permissions)) {
		_permissions = [_permissions];
	}
	for (let index = 0; index < _permissions.length; index++) {
		let {
			principal,
			allow
		} = _permissions[index];
		if (!arrayIncludes([
			Principal.EXPLORER_READ,
			Principal.EXPLORER_WRITE,
			Principal.SYSTEM_ADMIN
		] as PrincipalKey[], principal)) {
			// Other principals are not allowed write access
			if (!Array.isArray(allow)) {
				allow = [allow];
			}
			if (
				allow.length > 0
				&& (
					allow.length > 1 || allow[0] !== 'READ'
				)
			) {
				log.warning(`node.cleanPermissions: Principal:${principal} is not allowed write access! Tried to set allow:${toStr(allow)} node:${toStr(node)})}`);
				if (arrayIncludes(allow, 'READ')) {
					safePermissions.push({
						principal,
						allow: 'READ'
					});
				}
			}
		}
	} // for
	return safePermissions;
}
