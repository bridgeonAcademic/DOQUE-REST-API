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

const adminLoginSchema = z.object({
	email: z.string().email(),
	password: z.string().min(6),
});

const chatSchema = z.object({
	content: z.string().min(1),
});

const workspaceSchema = z.object({
	name: z.string(),
	description: z.string().optional(),
	visibility: z.string().optional(),
});

export { loginSchema, registerSchema, otpSchema, spaceSchema, adminLoginSchema, chatSchema, workspaceSchema };
