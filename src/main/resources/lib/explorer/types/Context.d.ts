import type { Context } from '@enonic-types/lib-context';
import type { PrincipalKey } from '@enonic/js-utils/types/Auth.d';


export type ContextAttributes = Record<string, string | boolean | number>;

export interface User {
	readonly type: string;
	readonly key: string;
	readonly displayName: string;
	readonly disabled: boolean;
	readonly email: string;
	readonly login: string;
	readonly idProvider: string;
}

export interface AuthInfo {
	readonly user: User;
	readonly principals: ReadonlyArray<PrincipalKey>;
}

export type GetContext = Context;
// export interface GetContext<
// 	Attributes extends ContextAttributes | undefined = undefined
// > {
// 	readonly repository :string;
// 	readonly branch: string;
// 	readonly authInfo: AuthInfo;
// 	readonly attributes?: Attributes;
// }
