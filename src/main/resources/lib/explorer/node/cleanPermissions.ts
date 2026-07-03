import type { PrincipalKey } from '@enonic-types/lib-auth';
import type { AccessControlEntry } from '@enonic-types/lib-node';


import {
    ROOT_PERMISSIONS_EXPLORER,
    Principal,
} from '@enonic/explorer-utils';
import { includes as arrayIncludes } from '@enonic/js-utils/array/includes';
import { toStr } from '@enonic/js-utils/value/toStr';


const LOG_PREFIX = 'node.cleanPermissions:';


export default function cleanPermissions({
    _permissions = [],
    node,
}: {
    _permissions: AccessControlEntry[];
    node: unknown;
}): AccessControlEntry[] {
    const safePermissions = [...ROOT_PERMISSIONS_EXPLORER]; // deref
    if (!Array.isArray(_permissions)) {
        _permissions = [_permissions];
    }
    for (let index = 0; index < _permissions.length; index++) {
        const {
            principal,
        } = _permissions[index];
        let {
            allow
        } = _permissions[index];

        // Only explorer and sysadmin are allowed write access,
        // other principals keep their read access.
        if (!arrayIncludes([
            Principal.EXPLORER_READ,
            Principal.EXPLORER_WRITE,
            Principal.SYSTEM_ADMIN
        ] as PrincipalKey[], principal)) {
            if (allow) { // allow can be undefined

                // TODO: According to @enonic-types/lib-node: allow when defined is always an array,
                // so this "forcearray", might not be needed, but before removing the code that
                // should be verified in this usecase.
                if (!Array.isArray(allow)) {
                    allow = [allow];
                }

                if (
                    allow.length > 0
                    && (
                        allow.length > 1 || allow[0] !== 'READ'
                    )
                ) {
                    log.warning(
                        '%s Principal:%s is not allowed write access! Tried to set allow:%s node:%s',
                        LOG_PREFIX, principal, toStr(allow), toStr(node),
                    );
                    if (arrayIncludes(allow, 'READ')) {
                        safePermissions.push({
                            principal,
                            allow: ['READ']
                        });
                    }
                }
            } // if allow
        } // if principal is "unprivileged" (and should only be allowed read permission)
    } // for
    return safePermissions;
}
