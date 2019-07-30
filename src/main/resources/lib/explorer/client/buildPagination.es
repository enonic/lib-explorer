//──────────────────────────────────────────────────────────────────────────────
// Enonic XP libs (externals not webpacked)
//──────────────────────────────────────────────────────────────────────────────
//import {toStr} from '/lib/util';
import {forceArray} from '/lib/util/data';

import {localize} from '/lib/xp/i18n';

import {APP_EXPLORER} from '/lib/explorer/model/2/constants';

//──────────────────────────────────────────────────────────────────────────────
// Public function
//──────────────────────────────────────────────────────────────────────────────
export function buildPagination({
	facets,
	locale,
	name, // name of url query parameter that contains the searchString
	page,
	pages,
	paginationConfig,
	searchString
}) {
	//log.info(toStr({searchString}));
	if (!paginationConfig) { return []; }

	//log.info(toStr({facets}));
	const postfix = facets ? Object.keys(facets)
		.map(key => forceArray(facets[key])
			.map(value => value ? `&${key}=${value}` : '')
			.join(''))
		.join('') : '';
	const href = `?${name}=${searchString}${postfix}`;
	//log.info(toStr({href}));
	const {
		pagesToShow = 10,
		first = true,
		prev = true,
		next = true,
		last = true
	} = paginationConfig;

	const pagination = [];
	if (first && page > 1) {
		pagination.push({
			href,
			text: localize({
				application: APP_EXPLORER,
				key: 'pagination.first',
				locale
			})
		});
	}

	if (prev && page > 2) {
		pagination.push({
			href: `${href}&page=${page - 1}`,
			text: localize({
				application: APP_EXPLORER,
				key: 'pagination.prev',
				locale
			})
		});
	}

	const half = Math.ceil(pagesToShow / 2);
	const firstPageToShow = Math.max(1, Math.min(pages - pagesToShow + 1, page - half));
	const lastPageToShow = Math.min(pages, firstPageToShow + pagesToShow - 1);
	/*log.info(toStr({
		page, pagesToShow, half, firstPageToShow, pages, lastPageToShow
	}));*/
	for (let i = firstPageToShow; i <= lastPageToShow; i += 1) {
		//log.info(toStr({i, page}));
		pagination.push({
			href: i === page ? null : `${href}${i === 1 ? '' : '&page=' + i}`, // eslint-disable-line prefer-template
			text: `${i}`
		});
	} // for

	if (page < pages) {
		if (next && page < (pages - 1)) {
			pagination.push({
				href: `${href}&page=${page + 1}`,
				text: localize({
					application: APP_EXPLORER,
					key: 'pagination.next',
					locale
				})
			});
		}
		if (last) {
			pagination.push({
				href: `${href}&page=${pages}`,
				text: localize({
					application: APP_EXPLORER,
					key: 'pagination.last',
					locale
				})
			});
		}
	}
	//log.info(toStr({pagination}));
	return pagination;
}
