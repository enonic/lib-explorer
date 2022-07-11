import {PATH_DOCUMENT_TYPE_FOLDER} from '/lib/explorer/documentType/constants';

export const documentTypeNameToPath = (documentTypeName :string) => `${PATH_DOCUMENT_TYPE_FOLDER}/${documentTypeName}`;
