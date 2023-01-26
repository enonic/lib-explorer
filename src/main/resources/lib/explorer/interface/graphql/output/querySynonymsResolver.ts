import type {
	Profiling,
	QuerySynonymsReturnType
} from '/lib/explorer/interface/graphql/output/index.d';


import {Principal} from '@enonic/explorer-utils';
import {currentTimeMillis} from '/lib/explorer/time/currentTimeMillis';
import {getInterfaceInfo} from '/lib/explorer/interface/graphql/output/getInterfaceInfo';
import {getSynonymsFromSearchString} from '/lib/explorer/synonym/getSynonymsFromSearchString';
import {connect} from '/lib/explorer/repo/connect';


export function querySynonymsResolver({
	args: {
		languages,
		profiling: profilingArg = false,
		searchString
	},
	context: {
		interfaceName,
		//logQuery = false,
		logSynonymsQuery = false,
		logSynonymsQueryResult = false//,
		//query: graphqlFieldsString
	}//,
	//source
}) {
	// log.debug('querySynonyms resolver interfaceName: %s', toStr(interfaceName));

	const profiling :Array<Profiling> = [];
	if (profilingArg) {
		profiling.push({
			currentTimeMillis: currentTimeMillis(),
			label: 'querySynonyms',
			operation: 'start'
		});
		//log.debug('profiling:%s', toStr(profiling));
	}
	//log.debug('querySynonyms resolver source: %s', toStr(source)); // null

	//log.debug('querySynonyms resolver graphqlFieldsString: %s', toStr(graphqlFieldsString));
	/*const graphqlDocument = parseGraphqlFields(graphqlFieldsString);
	profiling.push({
		currentTimeMillis: currentTimeMillis(),
		label: 'parseGraphqlFields'
	});
	//log.debug('querySynonyms resolver graphqlDocument: %s', toStr(graphqlDocument));
	log.debug('querySynonyms resolver graphqlDocument.definitions: %s', toStr(graphqlDocument.definitions));

	const graphqlFieldsObject = parseGraphqlAst(graphqlDocument.definitions);
	profiling.push({
		currentTimeMillis: currentTimeMillis(),
		label: 'parseGraphqlAst'
	});
	log.debug('querySynonyms resolver graphqlFieldsObject: %s', toStr(graphqlFieldsObject));*/

	const interfaceInfo = getInterfaceInfo({
		interfaceName
	});
	// log.debug('querySynonyms resolver interfaceInfo: %s', toStr(interfaceInfo));

	const {
		//collectionNameToId,
		//fields,
		interfaceId,
		localesInSelectedThesauri,
		//stopWords,
		thesauriNames
	} = interfaceInfo;

	if (profilingArg) {
		profiling.push({
			currentTimeMillis: currentTimeMillis(),
			label: 'querySynonyms',
			operation: 'getInterfaceInfo'
		});
		//log.debug('profiling:%s', toStr(profiling));
	}

	// TODO reuse interface information?
	const rv :QuerySynonymsReturnType = {
		interfaceInfo,
		languages: languages ? languages : localesInSelectedThesauri,
		searchString,
		synonyms: getSynonymsFromSearchString({
			explorerRepoReadConnection: connect({ principals: [Principal.EXPLORER_READ] }),
			defaultLocales: localesInSelectedThesauri,
			doProfiling: profilingArg,
			locales: languages,
			logQuery: logSynonymsQuery,
			logQueryResult: logSynonymsQueryResult,
			interfaceId,
			profilingArray: profiling, // Gets modified within
			profilingLabel: 'querySynonyms',
			searchString,
			showSynonyms: true, // TODO hardcode
			thesauri: thesauriNames
		})
	};
	if (profilingArg) {
		/*profiling.push({
			currentTimeMillis: currentTimeMillis(),
			label: 'querySynonyms: end'
		});*/
		rv.profiling = profiling;
	}
	// log.debug('querySynonyms resolver rv: %s', toStr(rv));
	return rv;
}
