import { prisma } from "@repo/database";
import { userSigninSchema, userSignupSchema } from "@repo/validators";
import { Request, Response } from "express";
import { comparePassword, hashPassword } from "../utils/hash.js";
import { generateToken } from "../utils/jwt.js";
import { AppError, createUser } from "@repo/functions";
import { ok } from "assert";

export const signIn = async (req: Request, res: Response) => {
  console.log("Sign IN called");
  console.log("Secret", process.env.port);
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
      role: user.role,
    });

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
  } catch (err) {
    return res.status(500).json({
      error: "Internal Server Error!!!",
      err,
    });
  }
};

export const createAgentAdminStaff = async (req: Request, res: Response) => {
  try {
    const user = req.user; // from JWT middleware

    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const role = req.body.role;

    // 🔥 ROLE LOGIC
    if (["admin", "partner", "staff"].includes(role)) {
      if (user.role !== "admin") {
        return res.status(403).json({
          error: "Only admin can create staff/partner/admin",
        });
      }

      req.body.createdById = user.id;

      if (req.body.isVerified === "true") {
        req.body.verifiedById = user.id;
      }
    }

    const adaptedFiles = (req.files as Express.Multer.File[]).map((file) => ({
      fieldname: file.fieldname,
      buffer: file.buffer,
      mimetype: file.mimetype,
      originalname: file.originalname,
    }));
    // 🔥 CALL SERVICE (IMPORTANT)
    const result = await createUser({
      body: req.body,
      files: adaptedFiles
    });

    return res.status(201).json({
      ok: true,
      result,
    });
  } catch (err:any) {
    // 🔥 HANDLE VALIDATION ERRORS (from Zod)
    if (err instanceof AppError) {
      return res.status(err.status).json({
        error: err.message,
        fieldErrors: err.fieldErrors || null,
      });
    }

    return res.status(500).json({
      error: "Internal Server Error!!!",
    });
  }
};

export const verifyAgent = async (req: Request, res: Response) => {
  try {
    const user = req.user;

    const { userId } = req.body;
    
    const result = await prisma.user.update({
      where: { id: userId },
      data : {
        isVerified: true,
        verifiedById: user.id,
        documents: { 
          updateMany: {
            where: {userId},
            data: {
              isVerified: true,
              verifiedById: user.id
            }
          } 
        }
      }
    })  

    return res.status(200).json({
      ok: true,
      result
    });
  } catch (err) {
    console.error("Error verifying agent:", err);
    return res.status(500).json({
      message: "Internal Server Error!!!",
    });
  }
}