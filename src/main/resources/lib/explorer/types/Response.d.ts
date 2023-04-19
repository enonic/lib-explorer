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
		'content-type'? :string
		'cache-control'? :string
		etag? :string|number
	}
	pageContributions? :PageContributions
	status? :number
}
