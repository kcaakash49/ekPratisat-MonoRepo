import { prisma } from "@repo/database";
import { userSigninSchema, userSignupSchema } from "@repo/validators";
import { Request, Response } from "express";
import { comparePassword, hashPassword } from "../utils/hash.js";
import { generateToken } from "../utils/jwt.js";


export const signUp = async(req: Request, res: Response) => {
    try {
        const result = userSignupSchema.safeParse(req.body);
        if (!result.success) {
          return res.status(400).json({ error: result.error.issues });
        }
    
        const { email, password, name, role, contact } = result.data;
    
        const existing = await prisma.user.findUnique({ where: { email, contact } });
        if (existing) {
          return res.status(409).json({ error: "User already exists" });
        }
    
        const hashed = await hashPassword(password);
        const user = await prisma.user.create({
          data: { email, password: hashed, name, role, contact },
        });
    
        return res
          .status(201)
          .json({
            message: "User Created Successfully!!!",
            user: { id: user.id, email: user.email, name: user.name, role: user.role},
          });
      } catch (error) {
        console.error("Signup error:", error);
        return res.status(500).json({ error: "Internal server error" });
      }
}

export const signIn = async(req: Request, res: Response) => {
    try{
        const result = userSigninSchema.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json({ error: result.error.issues });
          }
        const { contact , password } = result.data; 
        
        const user = await prisma.user.findUnique({
            where: {
                contact
            }
        })

        if (!user || !(await comparePassword(password, user.password))) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        return res.status(201).json({
            user: { id: user.id, email: user.email, name: user.name, role: user.role },
          });

    }catch{
        return res.status(500).json({
            error: "Internal Server Error"
        });
    }
}