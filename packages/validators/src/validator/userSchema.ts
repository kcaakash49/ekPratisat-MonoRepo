
import { z } from "zod";

export const userSignupSchema = z.object({
    name: z
      .string()
      .min(1, "Name is required")
      .refine(
        (val) => val.trim().split(" ").length >= 2,
        "Full name must include at least first and last name"
      ),
  
    role: z.enum(["admin", "partner", "client"]).default("client"),
  
    password: z
    .string()
    .refine(
      (val) =>
        val.length >= 8 &&
        /[A-Z]/.test(val) &&
        /[0-9]/.test(val) &&
        /[^A-Za-z0-9]/.test(val),
      {
        message:
          "Password must be at least 8 characters long and include 1 uppercase letter, 1 number, and 1 special character",
      }
    ),
  
    email: z.string().email("Invalid email address"),
  
    contact: z
      .string()
      .regex(/^\d{10}$/, "Contact must be exactly 10 digits"),
  });

export const userSigninSchema = z.object({
    contact: z.string(),
    password: z.string()
})

export type UserSingUpSchema = z.infer<typeof userSignupSchema>;

export type UserSigninSchema = z.infer<typeof userSigninSchema>;