import {getDocumentTypeByName as pureTsGetDocumentTypeByName} from '/lib/explorer/_uncoupled/documentType/getDocumentTypeByName';
import {javaBridge} from '../_coupling/javaBridge';


export function getDocumentTypeByName({
	documentTypeName
}: {
	documentTypeName: string
}) {
	return pureTsGetDocumentTypeByName({documentTypeName}, javaBridge);
}
