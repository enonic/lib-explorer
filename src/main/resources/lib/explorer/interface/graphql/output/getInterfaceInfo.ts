import type {InterfaceField} from '/lib/explorer/types/';
import type {CollectionNode} from '/lib/explorer/types/Collection.d';


import {
	arrayIncludes,
	getIn,
	isSet,
	// toStr,
} from '@enonic/js-utils';
import {
	COLLECTION_REPO_PREFIX,
	DEFAULT_INTERFACE_FIELDS,
	FIELD_PATH_META,
	PRINCIPAL_EXPLORER_READ
} from '/lib/explorer/constants';
import {getCollectionIds} from '/lib/explorer/collection/getCollectionIds';
import {get as getInterface} from '/lib/explorer/interface/get';
import {coerseInterfaceType} from '/lib/explorer/interface/coerseInterfaceType';
import {connect} from '/lib/explorer/repo/connect';
import {multiConnect} from '/lib/explorer/repo/multiConnect';
import {getThesaurus} from '/lib/explorer/thesaurus/getThesaurus';


export function getInterfaceInfo({
	interfaceName
}: {
	interfaceName: string
}) {
	const explorerRepoReadConnection = connect({ principals: [PRINCIPAL_EXPLORER_READ] });

	const interfaceNode = getInterface({
		connection: explorerRepoReadConnection,
		interfaceName
	});

	const filteredInterfaceNode = coerseInterfaceType(interfaceNode);
	// log.debug('getInterfaceInfo filteredInterfaceNode:%s', toStr(filteredInterfaceNode));

	const {
		_id: interfaceId,
		stopWords,
		synonymIds,
		termQueries,
	} = filteredInterfaceNode;
	// log.debug('getInterfaceInfo synonymIds:%s', toStr(synonymIds));

	let {fields} = filteredInterfaceNode;
	if (isSet(fields)) {
		if (Array.isArray(fields)) {
			if (!fields.length) { // Empty array
				fields = DEFAULT_INTERFACE_FIELDS;
			} /*else {
				// Everything is fine, so no-op
			}*/
		} else { // Not an array
			fields = [fields as unknown as InterfaceField];
		}
	} else {
		fields = DEFAULT_INTERFACE_FIELDS;
	}
	// log.debug('getInterfaceInfo fields:%s', toStr(fields));

	let {
		collectionIds,
	} = filteredInterfaceNode;

	if (interfaceName === 'default' ) {
		// The default interface has no collectionIds, so get all collectionIds:
		collectionIds = getCollectionIds({
			connection: explorerRepoReadConnection
		});
	}

	if (!collectionIds.length) {
		throw new Error(`interface:${interfaceName} has no collections!`);
	}

	const collectionIdsWithNames: {
		_id: string
		_name: string
	}[] = [];
	for (let i = 0; i < collectionIds.length; i++) {
		const collectionId = collectionIds[i];
		const collectionNode = explorerRepoReadConnection.get<CollectionNode>(collectionId) as CollectionNode;
		if (!collectionNode) {
			log.warning(`Interface ${interfaceName} with id ${interfaceId}, references a collection id ${collectionId} that doesn't exist!`);
		} else {
			const {_name: collectionName} = collectionNode;
			collectionIdsWithNames.push({
				_id: collectionId,
				_name: collectionName
			});
		}
	}
	// log.debug('getInterfaceInfo collectionIdsWithNames:%s', toStr(collectionIdsWithNames));

	//const collectionIdToName: Record<string,string> = {};
	const collectionNameToId: Record<string,string> = {};
	for (let i = 0; i < collectionIdsWithNames.length; i++) {
		const {_id, _name} = collectionIdsWithNames[i];
		//collectionIdToName[_id] = _name;
		collectionNameToId[_name] = _id;
	}

	//──────────────────────────────────────────────────────────────────────────

	// Multiconnect will fail when an interface has no existing collection nodes,
	// or TODO: no collection repos.
	const stemmingLanguages: string[] = [];
	if (collectionIdsWithNames.length) {
		const multiRepoReadConnection = multiConnect({
			principals: [PRINCIPAL_EXPLORER_READ],
			sources: Object.keys(collectionNameToId).map((collectionName) => ({
				repoId: `${COLLECTION_REPO_PREFIX}${collectionName}`,
				branch: 'master', // NOTE Hardcoded
				principals: [PRINCIPAL_EXPLORER_READ]
			}))
		});

		const languagesRes = multiRepoReadConnection.query({
			aggregations: {
				stemmingLanguages: {
					terms: {
						field: `${FIELD_PATH_META}.stemmingLanguage`,
						minDocCount: 1,
						order: '_count desc',
						size: 0, // Seems to mean infinite (undocumented)
					}
				}
			},
			count: 0,
			filters: {
				boolean: {
					must: {
						exists: {
							field: `${FIELD_PATH_META}.stemmingLanguage`
						}
					}
				}
			},
			query: ''/*{
				matchAll: {}
			}*/,
			//sort:
			start: 0
		});
		//log.debug('languagesRes:%s', toStr(languagesRes));
		// @ts-expect-error // TODO
		const buckets: {key: string}[] = getIn(languagesRes, 'aggregations.stemmingLanguages.buckets');
		if (buckets) {
			for (let i = 0; i < buckets.length; i++) {
				const {key} = buckets[i];
				if (!arrayIncludes(stemmingLanguages, key)) {
					stemmingLanguages.push(key);
				}
			}
		}
	} // if collectionIdsWithNames.length

	//──────────────────────────────────────────────────────────────────────────

	const localesInSelectedThesauri: string[] = [];
	const thesauriNames = synonymIds.length // Avoid: Cannot build empty 'IN' statements"
		? explorerRepoReadConnection.query({
			count: -1,
			query: {
				boolean: {
					must: {
						in: {
							field: '_id',
							values: synonymIds
						}
					}
				}
			}
		}).hits.map(({id}) => {
			try {
				const thesauriNode = getThesaurus({ // Will throw on error
					connection: explorerRepoReadConnection,
					_id: id
				});
				//log.debug('thesauriNode:%s', toStr(thesauriNode));
				const {allowedLanguages} = thesauriNode;
				for (let i = 0; i < allowedLanguages.length; i++) {
					const locale = allowedLanguages[i];
					if (!localesInSelectedThesauri.includes(locale)) {
						localesInSelectedThesauri.push(locale);
					}
				}
				return thesauriNode._name;
			} catch (e) {
				log.warning(`Interface ${interfaceName} refers to an thesarusId:${synonymIds} that doesn't exist?!`);
			}
		}).filter((x) => x)
		: []; // Remove missing thesauri.
	//log.debug('getInterfaceInfo thesauriNames:%s', toStr(thesauriNames));
	//log.debug('getInterfaceInfo localesInSelectedThesauri:%s', toStr(localesInSelectedThesauri));

	return {
		collectionNameToId,
		fields,
		interfaceId,
		localesInSelectedThesauri,
		stemmingLanguages,
		stopWords,
		termQueries,
		thesauriNames
	};
} // getInterfaceInfo
