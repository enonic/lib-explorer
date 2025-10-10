import type {
	ByteSource,
	DefaultResponseHeaders,
	Response,
	ResponseHeaders
} from '@enonic-types/core';

type LowercaseKeys<T extends object> = {
	[K in keyof T as Lowercase<K>]: T[K];
};

export type Http2ResponseHeaders = LowercaseKeys<ResponseHeaders>

export type DefaultHttp2ResponseHeaders = LowercaseKeys<DefaultResponseHeaders>

export type Http2Response<
	BODY = string,
	HEADERS extends Http2ResponseHeaders = DefaultHttp2ResponseHeaders
> = Response<{
	body?: BODY
	bodyStream?: ByteSource // Uncertain if this is correct, maybe only http client responses have this
	headers?: HEADERS
}>
