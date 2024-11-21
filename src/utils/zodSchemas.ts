import { string, z } from "zod";

const loginSchema = z.object({
	email: z.string(),
	password: z.string(),
});

const registerSchema = z.object({
	firstName: z.string().min(3),
	lastName: z.string().optional(),
	email: z.string().email(),
	password: z.string().min(4),
	image: z.string().optional(),
});

const otpSchema = z.object({
	email: z.string().email(),
	otp: z.string(),
});

const spaceSchema = z.object({
	name: z.string().min(3),
	description: z.string().optional(),
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

const chatSchema = z.object({
	content: z.string().min(1),
});

const editUserDetails = z.object({
	firstName: z.string().min(3),
	lastName: z.string().optional(),
	phoneNumber: z.string().optional(),
	image: z.string().optional(),
});

const workspaceSchema = z
	.object({
		name: z.string(),
		description: z.string().optional(),
		visibility: z.string().optional(),
	})
	.strict();

const inviteSchema = z.object({
	email: z.string().email(),
});

const createTasksSchema = z.object({
	title: z.string().min(3, "Task name must be at least 3 characters"),
	description: z.string().optional(),
	dueDate: z.string().optional(),
	priority: z.string().optional(),
	assignedTo: z.array(z.string()).optional(),
});
const updateTaskSchema = z.object({
	title: z.string().optional(),
	description: z.string().optional(),
	listId: z.string().optional(),
	dueDate: z.string().optional(),
	priority: z.string().optional(),
	assignedTo: z.array(z.string()).optional(),
});

export {
	loginSchema,
	registerSchema,
	otpSchema,
	spaceSchema,
	listSchema,
	adminLoginSchema,
	chatSchema,
	workspaceSchema,
	inviteSchema,
	editUserDetails,
	createTasksSchema,
	updateTaskSchema,
};
