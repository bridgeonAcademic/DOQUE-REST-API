import { z } from "zod";

const loginSchema = z.object({
	email: z.string(),
	password: z.string(),
});

const registerSchema = z.object({
	firstName: z.string().min(3),
	lastName: z.string().optional(),
	email: z.string().email(),
	password: z.string().min(4),
});

const otpSchema = z.object({
	email: z.string().email(),
	otp: z.string(),
});

const spaceSchema = z.object({
	name: z.string().min(3),
	description: z.string().optional(),
	workspaceId: z.string().optional(),
});

const listSchema = z.object({
	name: z.string().min(3, "List name must be at least 3 characters"),
	description: z.string().optional(),
	color: z.string().optional(),
	task: z.array(z.string()).optional(),
	spaceId: z.string().optional(),
});

const adminLoginSchema = z.object({
	email: z.string().email(),
	password: z.string().min(6),
});

export { loginSchema, registerSchema, otpSchema, spaceSchema, listSchema, adminLoginSchema };
