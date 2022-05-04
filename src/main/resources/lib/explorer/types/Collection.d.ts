import type {Node} from './Node.d';


export interface Collection {
	_id? :string
	_name :string
	//_nodeType :string // Useless info, always the same
	//_path :string // No reason to expose
	_score :number
	_versionKey :string
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

export type CollectionNode = Node<Collection>;

export interface Cron {
	minute :string,
	hour :string,
	dayOfMonth :string,
	month :string,
	dayOfWeek :string
}

export type CollectionWithCron = Collection & {
	cron :Cron | Array<Cron>
};

export type QueriedCollection = CollectionNode & {
	_score :number
}
