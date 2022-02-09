import type {RequiredNodeProperties} from '../types.d';


export interface CollectionSpecific {
	_score :number
	collector :{
		config :Object // TODO?
		name :string
		configJson :string
	}
	createdTime :Date | string
	creator :string,
	doCollect? :boolean
	documentCount :number
	documentTypeId :string
	interfaces :Array<string>
	language :string
	modifiedTime? :Date | string
	modifier? :string
}

export type CollectionNode = RequiredNodeProperties & CollectionSpecific;
