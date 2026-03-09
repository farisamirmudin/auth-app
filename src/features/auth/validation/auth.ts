import { z } from "zod";

export const loginSchema = z.object({
	email: z.email("Please enter a valid email address."),
	password: z.string().min(1, "Password is required."),
});

export const signupSchema = z.object({
	name: z.string().trim().min(1, "Name is required."),
	email: z.email("Please enter a valid email address."),
	password: z.string().min(6, "Password must be at least 6 characters."),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
export type SignupFormValues = z.infer<typeof signupSchema>;
