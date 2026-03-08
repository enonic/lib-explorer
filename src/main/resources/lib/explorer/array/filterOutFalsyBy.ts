export type NonFalsy<T> = Exclude<T, false | null | undefined | 0 | ''>;

export function filterOutFalsyBy<T, TValue>(
  arr: readonly T[],
  getValue: (item: T) => TValue
): Array<T & Record<never, NonFalsy<TValue>>> {
  if (!Array.isArray(arr)) {
    throw new TypeError(`filterFalsyBy expects an array, got ${typeof arr}`);
  }

  return arr.filter(item => !!getValue(item)) as Array<T & Record<never, NonFalsy<TValue>>>;
}
