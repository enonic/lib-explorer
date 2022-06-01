export type PageContributions = {
	headBegin? :Array<string>
	headEnd? :Array<string>
	bodyBegin? :Array<string>
	bodyEnd? :Array<string>
}


export type Response<
	Body extends unknown = string
> = {
	body? :Body
	contentType? :string
	headers? :{
		'Content-Type'? :string
		'Cache-Control'? :string
		ETag? :string|number
	}
	pageContributions? :PageContributions
	status? :number
}
