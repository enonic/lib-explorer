export type PageContributions = {
	headBegin?: string[]
	headEnd?: string[]
	bodyBegin?: string[]
	bodyEnd?: string[]
}

export type Http2ResponseHeaders = Record<Lowercase<string>, string|number>

export interface DefaultResponseHeaders extends Http2ResponseHeaders {
	// HTTP/2 uses lowercase header keys
	'content-type'?: string
	'cache-control'?: string
	etag?: string|number
}

export type Response<
	Body = string,
	Headers extends Http2ResponseHeaders = DefaultResponseHeaders
> = {
	body?: Body
	contentType?: string
	headers?: Headers
	pageContributions?: PageContributions
	status?: number
}
