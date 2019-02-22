import {toStr} from '/lib/enonic/util';

import {getLocale} from '/lib/xp/admin';


export function search(params) {
	const {
		//clearCache = false,
		facets,
		interface: interfaceName,
		name = 'q',
		locale = getLocale(),
		searchString = params[name] || ''
	} = params;
	log.info(toStr({
		facets,
		interfaceName,
		name,
		searchString
	}));
	return {
		params: {
			facets,
			interface: interfaceName,
			locale,
			name,
			searchString
		}
	};
} // function search
