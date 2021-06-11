const APPLICATION_SERVICE_BEAN = __.newBean('com.enonic.explorer.ApplicationServiceBean');

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
} = {}) {
	const applicationList = [];
	const installedApplications = __.toNativeObject(APPLICATION_SERVICE_BEAN.getInstalledApplications());
	installedApplications.forEach((applicationImpl) => {
		const key = applicationImpl.getKey().toString();

		let item = key;
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
			item = {key};
			if (getCapabilities) {
				item.capabilities = applicationImpl.getCapabilities(); // Only seen empty Array
			}
			if (getDisplayName) {
				item.displayName = applicationImpl.getDisplayName();
			}
			if (getIsStarted) {
				item.isStarted = applicationImpl.isStarted();
			}
			if (getIsSystem) {
				item.isSystem = applicationImpl.isSystem();
			}
			if (getMaxSystemVersion) {
				item.maxSystemVersion = applicationImpl.getMaxSystemVersion();
			}
			if (getMinSystemVersion) {
				item.minSystemVersion = applicationImpl.getMinSystemVersion();
			}
			if (getSystemVersion) {
				item.systemVersion = applicationImpl.getSystemVersion();
			}
			if (getUrl) {
				item.url = applicationImpl.getUrl();
			}
			if (getVendorName) {
				item.vendorName = applicationImpl.getVendorName();
			}
			if (getVendorUrl) {
				item.vendorUrl = applicationImpl.getVendorUrl();
			}
			if (getVersion) {
				item.version = applicationImpl.getVersion().toString();
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
			applicationList.push(item);
		}
	}); // installedApplications.forEach
	return applicationList;
} // function list
