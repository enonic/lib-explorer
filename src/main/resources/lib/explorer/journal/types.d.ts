export interface MsgUri {
	message :string
	uri :string
}

export interface Journal {
	name :string
	startTime :number
	errors :Array<MsgUri>
	successes :Array<MsgUri>
}
