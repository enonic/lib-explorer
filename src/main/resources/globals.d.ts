type ApplicationKey = string;

export {
	App,
	ApplicationKey,
	Log
};

declare global {
	interface AppConfigObject {
		[key :string] :unknown
	}
	interface App {
		readonly config :AppConfigObject
		readonly name :ApplicationKey
		readonly version :string
	}
	interface Log {
		debug(message :string, ...args :unknown[]): void
		error(message :string, ...args :unknown[]): void
		info(message :string, ...args :unknown[]): void
		warning(message :string, ...args :unknown[]): void
	}
	// We don't want any global objects, pass around JavaBridge instead
	//const app :App;
	//const log :Log;
}
