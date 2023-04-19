import type {
	AnyObject,
	EmptyObject,
	StringObject
} from './Utility';


import {HTTP_HEADERS} from '@enonic/explorer-utils';


export type Headers = {
	accept?: string
	'accept-charset'?: string
	'accept-encoding'?: string
	authorization?: string
	[HTTP_HEADERS.EXPLORER_INTERFACE_NAME]?: string
	'explorer-log-query'?: '1'
	'explorer-log-synonyms-query'?: '1'
	'explorer-log-synonyms-query-result'?: '1'
	'if-none-match'?: string
	'user-agent'?: string
}

export type Method = 'GET'|'POST'|'HEAD'|'PUT'|'DELETE'|'PATCH'

export type Mode = 'edit'|'inline'|'live'|'preview'


export type HttpClientRequest = {
	auth?: {
		user: string
		password: string
	}
	body?: string|AnyObject // (string | object) Body content to send with the request, usually for POST or PUT requests. It can be of type string or stream.
	certificates?: unknown
	clientCertificate?: unknown
	connectionTimeout?: number
	contentType?: string
	followRedirects?: boolean
	headers?: Headers
	method?: Method
	multipart?: Array<AnyObject>
	params?: StringObject
	proxy?: {
		host: string
		port: number
		user: string
		password: string
	}
	queryParams?: StringObject
	readTimeout?: number
	url: string
}


export type EnonicXpRequest<
	Params extends StringObject = EmptyObject,
	PathParams extends StringObject = EmptyObject
> = {
	body?: string
	contextPath?: string
	headers?: Headers
	host?: string
	method?: Method
	mode?: Mode
	params?: Params
	path?: string
	pathParams?: PathParams
	rawPath?: string
}
