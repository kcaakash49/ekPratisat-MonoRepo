import { prisma } from "@repo/database";
import { userSigninSchema, userSignupSchema } from "@repo/validators";
import { Request, Response } from "express";
import { comparePassword, hashPassword } from "../utils/hash.js";
import { generateToken } from "../utils/jwt.js";
import {  AppError, createUser } from "@repo/functions";
import { ok } from "assert";


export const signIn = async (req: Request, res: Response) => {
  console.log("Sign IN called");
  console.log("Secret", process.env.port)
  try {
    const result = userSigninSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: result.error.issues });
    }
    const { contact, password } = result.data;

    const user = await prisma.user.findUnique({
      where: {
        contact,
      },
    });

    if (!user || !(await comparePassword(password, user.password))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = generateToken({
      userId: user.id,
      role: user.role
    })

    console.log("Token", token);
    res.cookie("accessToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 24 * 30 * 60 * 60 * 1000,
      path: "/", // cookie available for entire domain
    });

    return res.status(201).json({
      ok: true,
    });
  } catch(err) {
    return res.status(500).json({
      error: "Internal Server Error!!!",
      err
    });
  }
};


export const signUp = async (req: Request, res: Response) => {
  try {
    const result = await createUser(req.body);
    if (result instanceof AppError) {
      return res.status(result.status).json({ error: result.message });
    }
    return res.status(201).json({
      ok: true,
    });
  }catch(err) {
    return res.status(500).json({
      error: "Internal Server Error!!!",
      err
    });
  }
}