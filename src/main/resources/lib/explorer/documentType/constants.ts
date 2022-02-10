import type {Path} from '/lib/explorer/types.d';

import {COLON_SIGN} from '@enonic/js-utils';

import {APP_EXPLORER} from '/lib/explorer/model/2/constants';


export const NT_DOCUMENT_TYPE = `${APP_EXPLORER}${COLON_SIGN}documentType`;
export const NAME_DOCUMENT_TYPE_FOLDER = 'documentTypes';
export const PATH_DOCUMENT_TYPE_FOLDER :Path = `/${NAME_DOCUMENT_TYPE_FOLDER}`;
