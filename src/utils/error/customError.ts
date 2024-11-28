export class CustomError extends Error {
	// all custom errors will extend this class
	statusCode: number;
	status: string;
	errorCode?: string;
	isOperational: boolean;
	constructor(message: string, statusCode = 500, errorCode?: string) {
		super(message);
		this.statusCode = statusCode;
		this.status = statusCode >= 400 && statusCode < 500 ? "fail" : "error";
		this.errorCode = errorCode;
		this.isOperational = true;

		Error.captureStackTrace(this, this.constructor);
	}
}
