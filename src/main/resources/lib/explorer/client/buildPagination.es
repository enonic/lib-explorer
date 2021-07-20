import {
	forceArray//,
	//toStr
} from '@enonic/js-utils';

//──────────────────────────────────────────────────────────────────────────────
// Enonic XP libs (externals not webpacked)
//──────────────────────────────────────────────────────────────────────────────
import {localize} from '/lib/xp/i18n';

import {APP_EXPLORER} from '/lib/explorer/model/2/constants';

const PHRASE_KEY_PAGINATION_FIRST = 'pagination.first';
const PHRASE_KEY_PAGINATION_PREV = 'pagination.prev';
const PHRASE_KEY_PAGINATION_NEXT = 'pagination.next';
const PHRASE_KEY_PAGINATION_LAST = 'pagination.last';

//──────────────────────────────────────────────────────────────────────────────
// Public function
//──────────────────────────────────────────────────────────────────────────────
export function buildPagination({
	facets,
	locale,
	name, // name of url query parameter that contains the searchString
	page,
	pages,
	paginationConfig = {
		pagesToShow: 10,
		first: true,
		prev: true,
		next: true,
		last: true/*,
		firstPhrase: PHRASE_KEY_PAGINATION_FIRST,
		prevPhrase: PHRASE_KEY_PAGINATION_PREV,
		nextPhrase: PHRASE_KEY_PAGINATION_NEXT,
		lastPhrase: 'pagination.last'*/
	},
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
			page: 1,
			phraseKey: PHRASE_KEY_PAGINATION_FIRST,
			text: localize({
				application: APP_EXPLORER,
				key: PHRASE_KEY_PAGINATION_FIRST,
				locale
			})
		});
	}

	if (prev && page > 2) {
		pagination.push({
			href: `${href}&page=${page - 1}`,
			page: page - 1,
			phraseKey: PHRASE_KEY_PAGINATION_PREV,
			text: localize({
				application: APP_EXPLORER,
				key: PHRASE_KEY_PAGINATION_PREV,
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
			page: i,
			text: `${i}`
		});
	} // for

	if (page < pages) {
		if (next && page < (pages - 1)) {
			pagination.push({
				href: `${href}&page=${page + 1}`,
				page: page + 1,
				phraseKey: PHRASE_KEY_PAGINATION_NEXT,
				text: localize({
					application: APP_EXPLORER,
					key: PHRASE_KEY_PAGINATION_NEXT,
					locale
				})
			});
		}
		if (last) {
			pagination.push({
				href: `${href}&page=${pages}`,
				page: pages,
				phraseKey: PHRASE_KEY_PAGINATION_LAST,
				text: localize({
					application: APP_EXPLORER,
					key: PHRASE_KEY_PAGINATION_LAST,
					locale
				})
			});
		}
	}
	//log.info(toStr({pagination}));
	return pagination;
}
