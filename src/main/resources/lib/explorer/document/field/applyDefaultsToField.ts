import type { DocumentTypeField } from '@enonic-types/lib-explorer';

import {
	INDEX_CONFIG_ENABLED_DEFAULT,
	INDEX_CONFIG_FULLTEXT_DEFAULT,
	INDEX_CONFIG_INCLUDE_IN_ALL_TEXT_DEFAULT,
	INDEX_CONFIG_N_GRAM_DEFAULT,
	INDEX_CONFIG_PATH_DEFAULT,
} from '@enonic/js-utils/storage/indexing/constants';
import { VALUE_TYPE_STRING } from '@enonic/js-utils/storage/indexing/valueType/constants';
import { toStr } from '@enonic/js-utils/value/toStr';

import { isField } from './isField';

export function applyDefaultsToField(
	field: Partial<DocumentTypeField>,
): Readonly<Required<DocumentTypeField>> {
	if (!isField(field)) {
		throw new TypeError(`applyDefaultsToField: field not of type Field! field:${toStr(field)}`);
	}

	const {
		active = true,
		enabled = INDEX_CONFIG_ENABLED_DEFAULT,
		fulltext = INDEX_CONFIG_FULLTEXT_DEFAULT,
		includeInAllText = INDEX_CONFIG_INCLUDE_IN_ALL_TEXT_DEFAULT,
		max = 0,
		min = 0,
		name,
		nGram = INDEX_CONFIG_N_GRAM_DEFAULT,
		path = INDEX_CONFIG_PATH_DEFAULT,
		stemmed = false,
		valueType = VALUE_TYPE_STRING
	} = field;

	const FIELD: Partial<DocumentTypeField> = {
		active,
		enabled,
		fulltext,
		includeInAllText,
		max,
		min,
		nGram,
		path,
		stemmed,
		valueType
	};

	if (name) {
		FIELD.name = name;
	}

	return FIELD as Required<DocumentTypeField>;
}
