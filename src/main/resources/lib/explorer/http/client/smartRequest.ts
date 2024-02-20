import type {HttpClient} from '/lib/explorer/types/';


import {toStr} from '@enonic/js-utils/value/toStr';

// Docs: https://developer.enonic.com/docs/http-client-library
// @ts-expect-error No types yet.
import {request as httpClientRequest} from '/lib/http-client';
import {sleep} from '/lib/xp/task';


interface StateRef {
	prevReqFinishedAtMillis: null|number
}


//@ts-ignore TODO Add global types in tsconfig.json
const {currentTimeMillis} = Java.type('java.lang.System');


type SmartRequestParams = HttpClient.Request & {
	delay?: number
	retries?: number
	retryCount?: number
	stateRef?: StateRef
	logRequests?: boolean
	logResponses?: boolean
};

export function smartRequest(smartRequestParams: SmartRequestParams) {
	const {
		// Required
		url,
		// Optional
		auth,
		body,
		connectionTimeout = 20000, // Default in httpClientRequest is 10000.
		contentType,
		delay = 1000,
		disableHttp2, // Default in httpClientRequest is false.
		followRedirects,
		headers, // = {}, // Headers are optional, so no need to default to empty object.
		method, // = 'GET', // Default already GET in httpClientRequest.
		multipart,

		// NOTE: Do NOT default to an empty object as that causes contentType
		// to change into application/x-www-form-urlencoded and browserless
		// will not work
		params, // = {},

		proxy,
		queryParams,
		readTimeout = 5000, // Default in httpClientRequest is 10000
		retries = 0,
		retryCount = 0, // Gets incremented on recursion
		stateRef = { prevReqFinishedAtMillis: null },
		// Debugging
		logRequests = false,
		logResponses = false,
	} = smartRequestParams;

	//log.info(toStr({delay, retries, retryCount}));
	const reqParams: HttpClient.Request = {
		connectionTimeout,
		readTimeout,
		url
	};
	//log.info(toStr({body, headers, url}));
	if (auth) { reqParams.auth = auth; }
	if (body) { reqParams.body = body; }
	if (contentType) { reqParams.contentType = contentType; }
	if (disableHttp2) { reqParams.disableHttp2 = disableHttp2; }
	if (followRedirects) { reqParams.followRedirects = followRedirects; }
	if (headers) { reqParams.headers = headers; }
	if (method) { reqParams.method = method; }
	if (multipart) { reqParams.multipart = multipart; }
	if (params) { reqParams.params = params; }
	if (proxy) { reqParams.proxy = proxy; }
	if (queryParams) { reqParams.queryParams = queryParams; }
	//log.info(toStr({reqParams}));

	let response: HttpClient.Response;
	try {
		if (stateRef && stateRef.prevReqFinishedAtMillis && delay) {
			const msToSleep = delay - (currentTimeMillis() - stateRef.prevReqFinishedAtMillis);
			//log.info(toStr({msToSleep}));
			if (msToSleep) { sleep(msToSleep); }
		}
		//const sentRequestAtMillis = currentTimeMillis();
		log[logRequests ? 'info': 'debug']('smartRequest retryCount:%s httpClientRequestParams:%s', retryCount, toStr(reqParams));
		response = httpClientRequest(reqParams);
		stateRef.prevReqFinishedAtMillis = currentTimeMillis();
		log[logResponses ? 'info': 'debug']('smartRequest httpClientRequest Response:%s', toStr(response)); // Sometimes huge!
		//const latency = stateRef.prevReqFinishedAtMillis - sentRequestAtMillis;
		//log.info(toStr({latency}));
	} catch (e) {
		stateRef.prevReqFinishedAtMillis = currentTimeMillis();

		//@ts-ignore
		if (e instanceof java.net.ConnectException) {
			log.warning(e.message + ': on url:' + url/*, e*/); // Don't want stacktrace
			//@ts-ignore
		} else if (e instanceof java.net.SocketTimeoutException) {
			if(e.message === 'connect timed out') {
				log.warning(e.message + ': connectionTimeout ' + connectionTimeout + 'ms exceeded on url ' + url/*, e*/); // Don't want stacktrace
			} else if (e.message === 'timeout') {
				log.warning(e.message + ': readTimeout ' + readTimeout + 'ms exceeded on url ' + url/*, e*/); // Don't want stacktrace
			} else {
				log.warning('java.net.SocketTimeoutException with unknown message:' + e.message, e);
			}
			//@ts-ignore
		} else if (e instanceof java.lang.NullPointerException) {
			log.error('java.lang.NullPointerException with message:' + e.message, e);
		} else {
			// TODO java.lang.RuntimeException: SSL peer shut down incorrectly
			log.error(e.message + ': unhandled error on url:' + url, e);
		}
		if(retries && retryCount < retries) {
			const retrySmartRequest: SmartRequestParams = JSON.parse(JSON.stringify(reqParams));
			retrySmartRequest.connectionTimeout = connectionTimeout * 2; // Double on each retry
			retrySmartRequest.delay = delay;
			retrySmartRequest.readTimeout = readTimeout * 2; // Double on each retry
			retrySmartRequest.retries = retries;
			retrySmartRequest.retryCount = retryCount + 1; // Increment before recursion
			retrySmartRequest.stateRef = stateRef; // Pass on reference
			response = smartRequest(retrySmartRequest); // Recursion
		} else {
			throw e;
		}
	} // catch

	//log.info(toStr({response}));
	return response;
} // function smartRequest
