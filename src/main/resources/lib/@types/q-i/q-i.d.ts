interface Options {
	maxItems?: number,
}

declare module 'q-i' {
	function print<T = unknown>(object: T, options?: Options) : void;
	function stringify<T = unknown>(object: T, options?: Options) : string;
}
