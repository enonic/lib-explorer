export type JournalError = {
	message :string
	uri :string
};

export type JournalSuccess = {
	message ?:string // For example 'deleted'
	uri :string
};

export interface MsgUri {
	message :string
	uri :string
}

export interface Journal {
	name :string
	startTime :number
	errors :Array<JournalError>
	successes :Array<JournalSuccess>
}
