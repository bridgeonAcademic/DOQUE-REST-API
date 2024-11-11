export class StandardResponse {
	// all responses will extend this class
	statusCode: number;
	status: string;
	message: string;
	// biome-ignore lint/suspicious/noExplicitAny:
	data: any;
	// biome-ignore lint/suspicious/noExplicitAny: response data can be any type
	constructor(message: string, data: any, statusCode = 200) {
		this.statusCode = statusCode;
		this.status = "success";
		this.message = message;
		this.data = data;
	}
}
