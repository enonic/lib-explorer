type ReplacerFn = (this: unknown, key: string, value: unknown) => unknown;
type Replacer = ReplacerFn | Array<string | number> | null;


export const toStr = (
	value: unknown,
	replacer: Replacer = null,
	space: string | number = 4
): string => JSON.stringify(value, replacer as ReplacerFn, space);


export default {
	toStr
};
