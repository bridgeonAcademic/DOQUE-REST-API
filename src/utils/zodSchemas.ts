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

const adminLoginSchema = z.object({
	email: z.string().email(),
	password: z.string().min(6),
});

export { loginSchema, registerSchema, adminLoginSchema };
