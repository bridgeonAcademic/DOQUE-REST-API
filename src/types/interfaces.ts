import type { Request } from "express";
import type { JwtPayload } from "jsonwebtoken";

export interface CustomRequest extends Request {
	user?: JwtPayload | string;
}
