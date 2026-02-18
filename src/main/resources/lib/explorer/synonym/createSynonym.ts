import type { RepoConnection } from '/lib/xp/node';
import type {
	InputTypeLanguageSynonym,
	InputTypeSynonymLanguages,
	SynonymNode,
	SynonymNodeCreateParams,
	Write_SynonymNode_LanguagesSynonymObject,
	WriteConnection
} from '../types.d';


import {
	forceArray,
	isSet,
	toStr
} from '@enonic/js-utils';
import {
	FOLDER_THESAURI,
	NT_INTERFACE,
	NT_SYNONYM
} from '/lib/explorer/constants';
import { create } from '/lib/explorer/node/create';
import {buildSynonymIndexConfig} from '/lib/explorer/synonym/buildSynonymIndexConfig';
import {moldSynonymNode} from '/lib/explorer/synonym/moldSynonymNode';
import {getThesaurus} from '/lib/explorer/thesaurus/getThesaurus';
import {getUser} from '/lib/xp/auth';
import {reference as referenceValue} from '/lib/xp/value';


export function getValidInterfaceIds({
	explorerRepoReadConnection,
	interfaceIdsArray,
	interfaceIdsChecked, // modified within
}: {
	explorerRepoReadConnection: RepoConnection|WriteConnection,
	interfaceIdsArray: ReadonlyArray<string>
	interfaceIdsChecked: Record<string,boolean> // modified within
}) {
	const validInterfaceIds=[];
	for (let i = 0; i < interfaceIdsArray.length; i++) {
		const interfaceId = interfaceIdsArray[i];
		if (!isSet(interfaceIdsChecked[interfaceId])) {
			const interfaceNode = explorerRepoReadConnection.get(interfaceId);
			//log.debug('interfaceNode:%s', toStr(interfaceNode));
			if (!interfaceNode) {
				log.warning(`Unable to find interface with id:${interfaceId}!`);
				interfaceIdsChecked[interfaceId] = false;
			} else if (interfaceNode._nodeType !== NT_INTERFACE) {
				log.warning(`Node with id:${interfaceId} not an interface!`);
				interfaceIdsChecked[interfaceId] = false;
			} else {
				interfaceIdsChecked[interfaceId] = true;
			}
		}
		if (interfaceIdsChecked[interfaceId]) {
			validInterfaceIds.push(interfaceId);
		}
	} // for interfaceIdsArray
	return validInterfaceIds;
}


function arrayOfInputTypeLanguageSynonymsToArrayOfSynonymNodeLanguageSynonyms({
	arrayOfInputTypeLanguageSynonyms,
	checkInterfaceIds = false,
	explorerRepoReadConnection,
	interfaceIdsChecked
}: {
	arrayOfInputTypeLanguageSynonyms: InputTypeLanguageSynonym[]
	checkInterfaceIds: boolean
	explorerRepoReadConnection: RepoConnection
	interfaceIdsChecked: Record<string,boolean> // modified within
}) {
	const arrayOfSynonymNodeLanguageSynonyms: Write_SynonymNode_LanguagesSynonymObject[] = [];
	for (let j = 0; j < arrayOfInputTypeLanguageSynonyms.length; j++) {
		const {
			comment = '',
			disabledInInterfaces = [],
			enabled = true,
			synonym,
		} = arrayOfInputTypeLanguageSynonyms[j];
		if (synonym) {
			arrayOfSynonymNodeLanguageSynonyms.push({
				comment,
				disabledInInterfaces: checkInterfaceIds
					? getValidInterfaceIds({
						explorerRepoReadConnection,
						interfaceIdsArray: disabledInInterfaces,
						interfaceIdsChecked // modified within
					}).map((validInterfaceId) => referenceValue(validInterfaceId))
					: disabledInInterfaces
						? forceArray(disabledInInterfaces).map((uncheckedInterfaceId) => referenceValue(uncheckedInterfaceId))
						: [],
				enabled,
				synonym
			})
		}
	} // for
	return arrayOfSynonymNodeLanguageSynonyms;
}


export function moldInputTypeLanguages({
	checkInterfaceIds = false,
	explorerRepoReadConnection,
	interfaceIdsChecked,
	languagesArg
}: {
	checkInterfaceIds: boolean
	explorerRepoReadConnection: RepoConnection
	interfaceIdsChecked: Record<string,boolean> // modified within
	languagesArg: InputTypeSynonymLanguages
}) {
	const languages = {};
	for (let i = 0; i < languagesArg.length; i++) {
		const {
			// Required
			locale,
			// Optional
			both = [],
			comment: languageComment = '',
			disabledInInterfaces: languageDisabledInInterfaces = [],
			enabled: languageEnabled = true,
			from = [],
			to = []
		} = languagesArg[i];
		languages[locale] = {
			both: arrayOfInputTypeLanguageSynonymsToArrayOfSynonymNodeLanguageSynonyms({
				arrayOfInputTypeLanguageSynonyms: both,
				explorerRepoReadConnection,
				interfaceIdsChecked,
				checkInterfaceIds
			}),
			comment: languageComment,
			disabledInInterfaces: checkInterfaceIds
				? getValidInterfaceIds({
					explorerRepoReadConnection,
					interfaceIdsArray: languageDisabledInInterfaces,
					interfaceIdsChecked, // modified within
				}).map((validInterfaceId) => referenceValue(validInterfaceId))
				: languageDisabledInInterfaces
					? forceArray(languageDisabledInInterfaces).map((uncheckedInterfaceId) => referenceValue(uncheckedInterfaceId))
					: [],
			enabled: languageEnabled,
			from: arrayOfInputTypeLanguageSynonymsToArrayOfSynonymNodeLanguageSynonyms({
				arrayOfInputTypeLanguageSynonyms: from,
				explorerRepoReadConnection,
				interfaceIdsChecked,
				checkInterfaceIds
			}),
			to: arrayOfInputTypeLanguageSynonymsToArrayOfSynonymNodeLanguageSynonyms({
				arrayOfInputTypeLanguageSynonyms: to,
				explorerRepoReadConnection,
				interfaceIdsChecked,
				checkInterfaceIds
			})
		}
	} // for languagesArg
	return languages;
}


export function createSynonym({
	// Required
	thesaurusId,
	// Optional
	comment: commentArg = '',
	disabledInInterfaces: disabledInInterfacesArg = [],
	enabled: enabledArg = true,
	languages: languagesArg = [],
	thesaurusName,
}: {
	// Required
	thesaurusId: string
	// Optional
	comment?: string
	disabledInInterfaces?: string[]
	enabled?: boolean
	languages?: InputTypeSynonymLanguages
	thesaurusName?: string
}, {
	// Required
	explorerRepoWriteConnection,
	// Optional
	checkInterfaceIds = false,
	checkThesaurus = false,
	interfaceIdsChecked = {}, // modified within
	refreshRepoIndexes = true // Set to false when bulk importing...
}: {
	// Required
	explorerRepoWriteConnection: WriteConnection;
	// Optional
	checkInterfaceIds?: boolean;
	checkThesaurus?: boolean;
	interfaceIdsChecked?: Record<string,boolean>;
	refreshRepoIndexes?: boolean;
}) {
	if (!thesaurusName || checkThesaurus) {
		const thesaurusNode = getThesaurus({ // Will throw on error
			_id: thesaurusId,
			connection: explorerRepoWriteConnection
		});
		thesaurusName = thesaurusNode._name;
	} // if checkThesaurus

	const createSynonymParams: SynonymNodeCreateParams = {
		_nodeType: NT_SYNONYM,
		_parentPath: `/${FOLDER_THESAURI}/${thesaurusName}`,
		comment: commentArg,
		createdTime: new Date(),
		creator: getUser().key,
		disabledInInterfaces: checkInterfaceIds
			? getValidInterfaceIds({
				explorerRepoReadConnection: explorerRepoWriteConnection,
				interfaceIdsArray: disabledInInterfacesArg,
				interfaceIdsChecked // modified within
			}).map((validInterfaceId) => referenceValue(validInterfaceId))
			: disabledInInterfacesArg
				? forceArray(disabledInInterfacesArg).map((uncheckedInterfaceId) => referenceValue(uncheckedInterfaceId))
				: [],
		enabled: enabledArg,
		languages: moldInputTypeLanguages({
			explorerRepoReadConnection: explorerRepoWriteConnection,
			checkInterfaceIds,
			interfaceIdsChecked,
			languagesArg
		}),
		nodeTypeVersion: 2,
		thesaurusReference: referenceValue(thesaurusId),
	};
	createSynonymParams._indexConfig = buildSynonymIndexConfig({
		partialSynonymNode: createSynonymParams
	});

	const createRes = create(createSynonymParams, {
		connection: explorerRepoWriteConnection,
	}) as unknown as SynonymNode;
	if (!createRes) {
		log.error(`Something went wrong when trying to create synonym createSynonymParams:${toStr(createSynonymParams)} in thesaurus with id:${thesaurusId}`);
		throw new Error(`Something went wrong when trying to create synonym in thesaurus with id:${thesaurusId}!`);
	}
	if (refreshRepoIndexes) {
		explorerRepoWriteConnection.refresh();
	}

	return moldSynonymNode(createRes);
} // createSynonym
