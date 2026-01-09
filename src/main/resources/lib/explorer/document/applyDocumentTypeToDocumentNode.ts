import {
	DocumentNode,
	DocumentType
} from '@enonic-types/lib-explorer';


import { getIn } from '@enonic/js-utils/object/getIn';
import { setIn } from '@enonic/js-utils/object/setIn';
// import { toStr } from '@enonic/js-utils/value/toStr';


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
			const value = getIn(dereffedDocumentNode, name, undefined);
			if (typeof value === 'undefined') {
				// NOTE: The parent can be an array.
				// EXAMPLE: when name is "semantic.h1.text" then semantic.h1 is an array:
				// {
				//   semantic: {
				//    h1: [{
				//      title: 'Tittel'
				//      text: [
				//        'tekst1',
				//        'tekst2',
				//      ]
				//    }]
				//   }
				// }
				// So each item in the array must be handeled...
				const pathParts = name.split('.');
				const nameOnly = pathParts.pop();
				const parentPath = pathParts.join('.');
				const parentValue = getIn(dereffedDocumentNode, parentPath, undefined);
				// log.info('name:%s parentPath:%s parentValue:%s', name, parentPath, toStr(parentValue));
				// log.info('name:%s value:%s dereffedDocumentNode:%s', name, value, toStr(dereffedDocumentNode));
				if (Array.isArray(parentValue)) {
					for (let i = 0; i < parentValue.length; i++) {
						const itemPath = `${parentPath}.${i}.${nameOnly}`; // getIn doesn't support squareBraces []
						const itemValue = getIn(dereffedDocumentNode, itemPath, undefined);
						// log.info('itemPath:%s itemValue:%s', itemPath, toStr(itemValue));
						if (itemValue && !Array.isArray(itemValue)) {
							setIn(dereffedDocumentNode, itemPath, [itemValue]);
						}
					} // for
				} // TODO else log error (should never happen)
			}
			if (value && !Array.isArray(value)) {
				setIn(dereffedDocumentNode, name, [value]);
			}
		}
	} // for properties
	return dereffedDocumentNode;
} // applyDocumentTypeToDocumentNode
