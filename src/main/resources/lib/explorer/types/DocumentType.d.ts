import type {RequiredNodeProperties} from '../types.d';
import type {Fields} from './Field.d';


export interface DocumentTypeNode extends RequiredNodeProperties {
	addFields :boolean
	properties :Fields
	//createdTime? :Date | string
	//modifiedTime? :string
}
