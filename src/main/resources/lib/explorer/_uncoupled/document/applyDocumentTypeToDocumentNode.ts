import {
	DocumentNode,
	DocumentType
} from '/lib/explorer/types/';


import {
	//forceArray,
	getIn,
	setIn
} from '@enonic/js-utils';


// To possible approaches:
// 1. Loop over the documentType.properties, which name with nesting dots :)
// 2. Traverse documentNode (might be complex, let's try alternative 1 first)
export function applyDocumentTypeToDocumentNode({
	documentType,
	documentNode
} :{
	documentType: DocumentType
	documentNode: DocumentNode
}) {
	const dereffedDocumentNode = JSON.parse(JSON.stringify(documentNode)) as DocumentNode;
	for (let i = 0; i < documentType.properties.length; i++) {
		const {
			//active,
			//enabled,
			name,
			max,
			//min,
			//valueType
		} = documentType.properties[i];
		if (max !== 1) {
			const value = getIn(dereffedDocumentNode,name, undefined);
			if (value && !Array.isArray(value)) {
				setIn(dereffedDocumentNode, name, [value]);
			}
		}
	} // for properties
	return dereffedDocumentNode;
} // applyDocumentTypeToDocumentNode
