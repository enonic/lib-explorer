import {DOCUMENT_METADATA} from '/lib/explorer/model/2/constants';
import {addPropertiesToDocumentType} from '/lib/explorer/documentType/addPropertiesToDocumentType';
import {getPaths} from '/lib/explorer/object/getPaths';


export function maybeAddFields({
	documentType,
	node
}) {
	const {addFields = true} = documentType;
	//log.debug(`document.update addFields:${toStr(addFields)}`);

	if (!addFields) return;

	const fieldPaths = {};
	// TODO add all globalfields here?
	/*documentType.fields.forEach(({key}) => {
		fieldPaths[key] = true;
	});*/
	documentType.properties.forEach(({name}) => {
		fieldPaths[name] = true;
	});
	//log.debug(`document.update fieldPaths:${toStr(fieldPaths)}`);

	const paths = getPaths(node)
		.filter(arr => arr.length
			&& !arr[0].startsWith('_')
			&& arr[0] !== DOCUMENT_METADATA
		)
		.map(arr => arr.join('.'));
	//log.debug(`paths:${toStr(paths)}`);
	const propertiesToAdd = [];
	paths.forEach((p) => {
		if (!fieldPaths[p]) {
			propertiesToAdd.push(p);
		}
	});
	//log.debug(`propertiesToAdd:${toStr(propertiesToAdd)}`);
	if (propertiesToAdd.length) {
		addPropertiesToDocumentType({
			documentTypeId: documentType._id,
			properties: propertiesToAdd
		});
	}
}
