export class ValidationError extends Error {
	constructor(message: string) {
		//log.info('ValidationError.constructor');
		//log.info(`ValidationError.constructor params:${toStr(...params)}`);
		//log.info(`ValidationError.constructor params:${toStr(params)}`);
		super(message);

		// Maintains proper stack trace for where our error was thrown (only available on V8)
		if (Error.captureStackTrace) {
			Error.captureStackTrace(this, ValidationError);
		}

		this.name = 'ValidationError';
		//log.info('ValidationError.constructor end');
	}
}
