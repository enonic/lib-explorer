import type {
	AnyObject,
	StringObject
} from './Utility';


export type Headers = {
	Accept ?:string
	'Accept-Charset' ?:string
	'Accept-Encoding' ?:string
	Authorization ?:string
	'Explorer-Log-Query' ?:'1'
	'Explorer-Log-Synonyms-Query' ?:'1'
	'If-None-Match' ?:string
	'User-Agent' ?:string
}

export type Method = 'GET'|'POST'|'HEAD'|'PUT'|'DELETE'|'PATCH'

export type Mode = 'edit'|'inline'|'live'|'preview'


export type HttpClientRequest = {
	auth ?:{
		user :string
		password :string
	}
	body ?:string|AnyObject // (string | object) Body content to send with the request, usually for POST or PUT requests. It can be of type string or stream.
	certificates ?:unknown
	clientCertificate ?:unknown
	connectionTimeout ?:number
	contentType ?:string
	followRedirects ?:boolean
	headers ?:Headers
	method ?:Method
	multipart ?:Array<AnyObject>
	params ?:StringObject
	proxy ?:{
		host :string
		port :number
		user :string
		password :string
	}
	queryParams ?:StringObject
	readTimeout ?:number
	url :string
}


export type EnonicXpRequest<
	Params extends StringObject = {},
	PathParams extends StringObject = {}
> = {
	body ?:string
	contextPath ?:string
	headers ?:Headers
	host ?:string
	method ?:Method
	mode ?:Mode
	params ?:Params
	path ?:string
	pathParams ?:PathParams
	rawPath ?:string
}
