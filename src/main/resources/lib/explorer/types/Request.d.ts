import type { RequestMethod } from '@enonic-types/core';
import type { StringObject } from './Utility';


import {HTTP_HEADERS} from '@enonic/explorer-utils';


export type Headers = { // HTTP/2 uses lowercase header keys
	accept?: string
	'accept-charset'?: string
	'accept-encoding'?: string
	authorization?: string
	[HTTP_HEADERS.EXPLORER_INTERFACE_NAME]?: string
	'explorer-log-query'?: '1'
	'explorer-log-query-result'?: '1'
	'explorer-log-synonyms-query'?: '1'
	'explorer-log-synonyms-query-result'?: '1'
	'if-none-match'?: string
	'user-agent'?: string
}


export type HttpClientRequest = {
	auth?: {
		user: string
		password: string
	}
	body?: string|Record<string, unknown> // (string | object) Body content to send with the request, usually for POST or PUT requests. It can be of type string or stream.
	certificates?: unknown
	clientCertificate?: unknown
	connectionTimeout?: number
	contentType?: string
	followRedirects?: boolean
	headers?: Headers
	method?: RequestMethod
	multipart?: Record<string, unknown>[];
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
