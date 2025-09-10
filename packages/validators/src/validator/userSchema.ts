
import { z } from "zod";

export const userSignupSchema = z.object({
    name: z.string(),
    role: z.enum(['admin', 'partner','client']).default('client'),
    password: z.string(),
    email: z.email(),
    contact: z.string()

})

export const userSigninSchema = z.object({
    contact: z.string(),
    password: z.string()
})

export type UserSingUpSchema = z.infer<typeof userSignupSchema>;

export type UserSigninSchema = z.infer<typeof userSigninSchema>;