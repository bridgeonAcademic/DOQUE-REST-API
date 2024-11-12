export class CustomError extends Error {
	// all custom errors will extend this class
	statusCode: number;
	status: string;
	isOperational: boolean;
	constructor(message: string, statusCode = 500) {
		super(message);
		this.statusCode = statusCode;
		this.status = statusCode >= 400 && statusCode < 500 ? "fail" : "error";
		this.isOperational = true;

		Error.captureStackTrace(this, this.constructor);
	}
}
