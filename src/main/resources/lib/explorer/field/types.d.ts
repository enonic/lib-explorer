import type {RequiredNodeProperties} from '../types.d';


export interface FieldCommon {
	//creator :string
	//createdTime :Date|string
	fieldType :string
	indexConfig :{
		decideByType :boolean
		enabled :boolean
		nGram :boolean
		fulltext :boolean
		includeInAllText :boolean
		path :boolean
	}
	isSystemField? :boolean
	key :string
	max :number
	min :number
	//modifier? :string
	//modifiedTime? :Date|string
}

export type FieldNode = RequiredNodeProperties
	& FieldCommon;

export type Field = RequiredNodeProperties
	& FieldCommon
	& {
		valueType :string
	};
