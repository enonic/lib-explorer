//──────────────────────────────────────────────────────────────────────────────
//
// I want as much of the code as possible to be testable outside Enonic XP.
// A good way to achieve this is higher order programming.
// Any time a java lib or global is required, it must be passed in as a function,
// so it can be stubbed/mocked during testing.
//
//──────────────────────────────────────────────────────────────────────────────
//
// createDocument is a function that takes
//  data (to be cleaned, validated, typeCasted and persisted)
//  options (how to clean, validate and typeCast, where to persist)
//
//──────────────────────────────────────────────────────────────────────────────
import {cleanData} from './cleanData';
import {
	geoPointDummy,
	geoPointStringDummy,
	instantDummy,
	localDateDummy,
	localDateTimeDummy,
	localTimeDummy,
	logDummy,
	referenceDummy
} from './dummies';
import type {Fields} from './field';
import {fieldsArrayToObj} from './field';
import {validate} from './validate';
import {typeCastToJava} from './typeCastToJava';

interface LooseObject {
	[key :string] :unknown
}

interface CreateParameters {
	data: LooseObject
	fields :Fields
	validateOccurences? :boolean
	validateTypes? :boolean
}

interface CreateOptions {
	log :Log
	geoPoint :typeof geoPointDummy
	geoPointString :typeof geoPointStringDummy
	instant :typeof instantDummy
	localDate :typeof localDateDummy
	localDateTime :typeof localDateTimeDummy
	localTime :typeof localTimeDummy
	reference :typeof referenceDummy
}

// dieOnError
export function create({
	cleanExtraFields = false, // If true, extra fields can't cause error nor addType, because extra fields are deleted.
	denyExtraFields = cleanExtraFields, // If false, extra fields cause error and not persisted
	addTypeForNewFields = !denyExtraFields, // Detect from first instance? or always string?
	data,
	fields = [],
	validateOccurences = false, // previously requireValid?
	validateTypes = true // previously requireValid
} :CreateParameters, {
	log = logDummy,
	geoPoint = geoPointDummy,
	geoPointString = geoPointStringDummy,
	instant = instantDummy,
	localDate = localDateDummy,
	localDateTime = localDateTimeDummy,
	localTime = localTimeDummy,
	reference = referenceDummy
} :CreateOptions) {
	const fieldsObj = fieldsArrayToObj(fields, {log});
	const cleanedData = cleanData({
		cleanExtraFields,
		data,
		fieldsObj
	}, {log});
	const isValid = validate({
		data: cleanedData,
		fields,
		validateOccurences,
		validateTypes
	}, {log});
	const dataWithJavaTypes = typeCastToJava({
		data: cleanedData,
		fields
	}, { // Java objects and functions
		log,
		geoPoint,
		geoPointString,
		instant,
		localDate,
		localDateTime,
		localTime,
		reference
	} = {});
	/*const dataWithMetadata = addMetaData({
		//branchName
		//collectionId <- repoName:branchName:collectionId
		collection // <- collectionName, // Collections can be renamed :(
		collector: {
			id,
			version
		},
		createdTime,
		//creator,
		data,
		//documentTypeId <- repoName:branchName:documentTypeId
		documentType, // <- documentTypeName,
		language,
		modifiedTime,
		//repoName
		//owner,
		stemmingLanguage,
		valid,
	});
	const dataWithIndexConfig = addIndexConfig({data, fields});*/
}
