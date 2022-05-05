import type {RepoConnection} from '/lib/explorer/types/index.d';


//import {toStr} from '@enonic/js-utils';
import {PRINCIPAL_EXPLORER_READ} from '/lib/explorer/constants';
import {connect} from '/lib/explorer/repo/connect';
import {PATH_DOCUMENT_TYPE_FOLDER} from '/lib/explorer/documentType/constants';


export function exists({
	_name
} :{
	_name :string
}) {
	//log.debug('exists({ _name:%s })', _name);
	const readConnection = connect({ principals: [PRINCIPAL_EXPLORER_READ] }) as RepoConnection;
	const path = `${PATH_DOCUMENT_TYPE_FOLDER}/${_name}`;
	//log.debug('exists({ _name:%s }) path:%s', _name, path);
	return readConnection.exists(path);
}
