// error  Don't use `{}` as a type. `{}` actually means "any non-nullish value".
// - If you want a type meaning "any object", you probably want `Record<string, unknown>` instead.
// - If you want a type meaning "any value", you probably want `unknown` instead.
// - If you want a type meaning "empty object", you probably want `Record<string, never>` instead  @typescript-eslint/ban-types
export type AnyObject = Record<string, unknown>;
export type EmptyObject = Record<string, never>;


export type OneOrMore<T> = T | T[];
export type Unset = undefined | null;
export type ZeroOrMore<T> = Unset | OneOrMore<T>;

export type NonEmptyArray<T> = [T, ...T[]]
export type IsEmptyArray<T> = T extends any[]
  ? T extends NonEmptyArray<any>
    ? false
    : true
  : false
