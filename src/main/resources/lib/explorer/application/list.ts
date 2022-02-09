//@ts-ignore
const APPLICATION_SERVICE_BEAN = __.newBean('com.enonic.explorer.ApplicationServiceBean');


interface ApplicationListParam {
	filterOnIsStartedEquals? :boolean,
	filterOnIsSystemEquals? :boolean,
	getCapabilities? :boolean
	getDisplayName? :boolean
	getIsStarted? :boolean
	getIsSystem? :boolean
	getMaxSystemVersion? :boolean
	getMinSystemVersion? :boolean
	getSystemVersion? :boolean
	getUrl? :boolean
	getVendorName? :boolean
	getVendorUrl? :boolean
	getVersion ? :boolean
}

type Capability = string;

type Application = string|{
	capabilities? :Array<Capability>
	displayName? :string
	isStarted? :boolean
	isSystem? :boolean
	key :string
	maxSystemVersion? :string
	minSystemVersion? :string
	systemVersion? :string
	url? :string
	vendorName? :string
	vendorUrl? :string
	version? :string
};

interface ApplicationImpl {
	getCapabilities :() => Array<Capability>
	getDisplayName :() => string
	getKey :() => {
		toString :() => string
	}
	getMaxSystemVersion :() => string
	getMinSystemVersion :() => string
	getSystemVersion :() => string
	getUrl :() => string
	getVendorName :() => string
	getVendorUrl :() => string
	getVersion :() => string
	isStarted :() => boolean
	isSystem :() => boolean
}


export function list({
	// if true ; return only apps where true
	// if false ; return only apps where false
	// if not true or false ; return all apps
	filterOnIsStartedEquals = undefined,
	filterOnIsSystemEquals = undefined,

	// By default just returns a list of application keys
	// If any of these are true, returns list of application objects
	getCapabilities = false,
	getDisplayName = false,
	getIsStarted = false,
	getIsSystem = false,
	getMaxSystemVersion = false,
	getMinSystemVersion = false,
	getSystemVersion = false,
	getUrl = false,
	getVendorName = false,
	getVendorUrl = false,
	getVersion = false
} :ApplicationListParam = {}) :Array<Application> {
	const applicationList :Array<Application> = [];

	//@ts-ignore
	const installedApplications = __.toNativeObject(APPLICATION_SERVICE_BEAN.getInstalledApplications());

	installedApplications.forEach((applicationImpl :ApplicationImpl) => {
		const key = applicationImpl.getKey().toString();

		let application :Application = key;
		if (
			getCapabilities
			|| getDisplayName
			|| getIsStarted
			|| getIsSystem
			|| getMaxSystemVersion
			|| getMinSystemVersion
			|| getSystemVersion
			|| getUrl
			|| getVendorName
			|| getVendorUrl
			|| getVersion
		) {
			application = {key};
			if (getCapabilities) {
				application.capabilities = applicationImpl.getCapabilities(); // Only seen empty Array
			}
			if (getDisplayName) {
				application.displayName = applicationImpl.getDisplayName();
			}
			if (getIsStarted) {
				application.isStarted = applicationImpl.isStarted();
			}
			if (getIsSystem) {
				application.isSystem = applicationImpl.isSystem();
			}
			if (getMaxSystemVersion) {
				application.maxSystemVersion = applicationImpl.getMaxSystemVersion();
			}
			if (getMinSystemVersion) {
				application.minSystemVersion = applicationImpl.getMinSystemVersion();
			}
			if (getSystemVersion) {
				application.systemVersion = applicationImpl.getSystemVersion();
			}
			if (getUrl) {
				application.url = applicationImpl.getUrl();
			}
			if (getVendorName) {
				application.vendorName = applicationImpl.getVendorName();
			}
			if (getVendorUrl) {
				application.vendorUrl = applicationImpl.getVendorUrl();
			}
			if (getVersion) {
				application.version = applicationImpl.getVersion().toString();
			}
		} // if get...

		let includeApp = true; // Default is include

		if (filterOnIsStartedEquals === true) {
			if (!applicationImpl.isStarted()) {
				includeApp = false;
			}
		} else if(filterOnIsStartedEquals === false) {
			if (applicationImpl.isStarted()) {
				includeApp = false;
			}
		}

		if (filterOnIsSystemEquals === true) {
			if (!applicationImpl.isSystem()) {
				includeApp = false;
			}
		} else if(filterOnIsSystemEquals === false) {
			if (applicationImpl.isSystem()) {
				includeApp = false;
			}
		}

		if (includeApp) {
			applicationList.push(application);
		}
	}); // installedApplications.forEach
	return applicationList;
} // function list
