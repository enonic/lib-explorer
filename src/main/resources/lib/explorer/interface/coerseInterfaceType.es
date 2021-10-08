import {forceArray} from '@enonic/js-utils';

//import {reference} from '/lib/xp/value';


export const coerseInterfaceType = ({
	_id,
	_name,
	_nodeType,
	_path,
	_versionKey,
	collectionIds = [],
	fields = [],
	//stopWordIds = [],
	stopWords = [],
	//synonymIds = []
	synonyms = []
}) => ({
	_id,
	_name,
	_nodeType,
	_path,
	_versionKey,

	// Reference doesn't work well when diffing or printing, so let's do that in the model
	collectionIds: forceArray(collectionIds),//.map((collectionId) => reference(collectionId)), // empty array allowed,
	fields: forceArray(fields),
	//stopWordIds: forceArray(stopWordIds),//.map((stopWordId) => reference(stopWordId)), // empty array allowed,
	stopWords: forceArray(stopWords),
	//synonymIds: forceArray(synonymIds),//.map((synonymId) => reference(synonymId)), // empty array allowed,
	synonyms: forceArray(synonyms)
});
