import { prisma } from "@repo/database";
import { userSigninSchema, userSignupSchema } from "@repo/validators";
import { Request, Response } from "express";
import { comparePassword, hashPassword } from "../utils/hash.js";
import { generateToken, verifyToken } from "../utils/jwt.js";
import { AppError, createUser } from "@repo/functions";


export const signIn = async (req: Request, res: Response) => {
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

    if (!user.isActive) {
      return res.status(403).json({ error: "Account is deactivated. Please contact support." });
    }

    const token = generateToken({
      userId: user.id,
      role: user.role,
      name: user.name,
      profileImageUrl: user.profileImageUrl,
    });

    
    res.cookie("accessToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 24 * 30 * 60 * 60 * 1000,
      path: "/", // cookie available for entire domain
      domain: process.env.NODE_ENV === "production" ? ".ekpratishat.com" : "localhost",
    });

    return res.status(201).json({
      ok: true,
      user: {
        id: user.id,
        role: user.role,
        name: user.name,
        profileImageUrl: user.profileImageUrl,
      }
    });
  } catch (err) {
    return res.status(500).json({
      error: "Internal Server Error!!!",
      err,
    });
  }
};

export const createClientUser = async(req:Request, res:Response) => {
  try {
    const adaptedFiles = (req.files as Express.Multer.File[]).map((file) => ({
      fieldname: file.fieldname,
      buffer: file.buffer,
      mimetype: file.mimetype,
      originalname: file.originalname,
    }));
    // 🔥 CALL SERVICE (IMPORTANT)
    const result = await createUser({
      body: req.body,
      files: adaptedFiles,
    });

     const token = generateToken({
      userId: result.user.id,
      role: result.user.role,
      name: result.user.name,
      profileImageUrl: result.user.profileImageUrl,
    });

    
    res.cookie("accessToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 24 * 30 * 60 * 60 * 1000,
      path: "/", // cookie available for entire domain
      domain: process.env.NODE_ENV === "production" ? ".ekpratishat.com" : "localhost",
    });

    return res.status(201).json({
      ok: true,
      result,
    });
  } catch (err: any) {
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
}

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
      files: adaptedFiles,
    });

    return res.status(201).json({
      ok: true,
      result,
    });
  } catch (err: any) {
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

    const { userId,isVerified } = req.body;


    const result = await prisma.user.update({
      where: { id: userId },
      data: {
        isVerified: !isVerified,
        verifiedById: user.id,
        documents: {
          updateMany: {
            where: { userId },
            data: {
              isVerified: true,
              verifiedById: user.id,
            },
          },
        },
      },
    });

    return res.status(200).json({
      ok: true,
      result,
    });
  } catch (err) {
    console.error("Error verifying agent:", err);
    return res.status(500).json({
      message: "Internal Server Error!!!",
    });
  }
};

export const signOut = (req: Request, res: Response) => {
  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    path: "/",
    domain: process.env.NODE_ENV === "production" ? ".ekpratishat.com" : "localhost",
  });

  return res.status(200).json({
    ok: true,
    message: "Logged Out!!!",
  });
};


export const myInfo = async (req: Request, res: Response) => {
  console.log("Received request for myInfo");
  let token: string | undefined;

  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith("Bearer")) {
    token = authHeader.split(" ")[1];
  }

  if (!token && req.cookies?.accessToken) {
    token = req.cookies.accessToken;
  }

  // Instead of 401, we return 200 with ok: false or user: null
  if (!token) {
    return res.status(200).json({
      ok: false,
      user: null,
      message: "Guest session"
    });
  }

  try {
    const payload = verifyToken(token);
    return res.status(200).json({
      ok: true,
      user: {
        id: payload.userId,
        role: payload.role,
        name: payload.name,
        profileImageUrl: payload.profileImageUrl,
      },
    });
  } catch (err) {
    // If the token is invalid/expired, we still send 200 but null the user
    // This forces the frontend to clear any old 'Admin' UI
    return res.status(200).json({
      ok: false,
      user: null,
      message: "Session expired"
    });
  }
};


export const removeAgent = async (req: Request, res: Response) => {
  try {
    
    const { agentId } = req.body;

    const result = await prisma.$transaction([
      prisma.agentGeoZone.deleteMany({
        where: { agentId },
      }),
      prisma.userDocument.updateMany({
        where: { userId: agentId },
        data: {
          isVerified: false,
          verifiedById: null,
        },
      }),
      prisma.user.update({
        where: { id: agentId },
        data: {
          isActive: false,
          isVerified:false,
          verifiedById:null
        }
      }),
    ]);

    return res.status(200).json({
      ok: true,
      result,
    });
  } catch (err) {
    console.error("Error removing agent:", err);
    return res.status(500).json({
      message: "Internal Server Error!!!",
    });
  }
}


