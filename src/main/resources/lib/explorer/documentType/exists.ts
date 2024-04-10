import type {RepoConnection} from '@enonic-types/lib-explorer';


//import {toStr} from '@enonic/js-utils';
import {PRINCIPAL_EXPLORER_READ} from '/lib/explorer/constants';
import {connect} from '/lib/explorer/repo/connect';
import {documentTypeNameToPath} from '/lib/explorer/documentType/documentTypeNameToPath';


export function exists({
	_name
}: {
	_name: string
}) {
	// log.debug('exists({ _name:%s })', _name);
	const readConnection = connect({ principals: [PRINCIPAL_EXPLORER_READ] }) as RepoConnection;
	const path = documentTypeNameToPath(_name);
	// log.debug('exists({ _name:%s }) path:%s', _name, path);
	return readConnection.exists(path);
}
