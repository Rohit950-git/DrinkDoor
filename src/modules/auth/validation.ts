import { z } from "zod";

export const registerSchema = z.object({
  name: z
    .string()
    .min(3, "Name should contain at least 3 characters"),

  email: z
    .string()
    .email("Invalid email"),

  phone: z
    .string()
    .optional(),

  password: z
    .string()
    .min(6, "Password should be at least 6 characters"),
});

export const loginSchema = z.object({
  email: z
    .string()
    .email("Invalid email"),

  password: z
    .string()
    .min(6, "Password should be at least 6 characters"),
});