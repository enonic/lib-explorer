import type {RequiredNodeProperties} from '../types.d';


export interface CollectionNodeSpecific {
	_score :number
	collector :{
		config :Object // TODO?
		name :string
		configJson :string
	}
	createdTime :Date | string
	creator :string,
	//cron :never // This is no longer stored on the CollectionNode but in the scheduling repo
	doCollect? :boolean
	documentCount :number
	documentTypeId :string
	interfaces :Array<string>
	language :string
	modifiedTime? :Date | string
	modifier? :string
}

export type CollectionNode = RequiredNodeProperties & CollectionNodeSpecific;

export interface Cron {
	minute :string,
	hour :string,
	dayOfMonth :string,
	month :string,
	dayOfWeek :string
}

export type Collection = CollectionNode & {
	cron :Cron | Array<Cron>
};

export type QueriedCollection = CollectionNode & {
	_score :number
}
