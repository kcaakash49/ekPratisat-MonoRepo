import { prisma } from "@repo/database";
import { userSigninSchema, userSignupSchema } from "@repo/validators";
import { Request, Response } from "express";
import { comparePassword, hashPassword } from "../utils/hash.js";
import { generateToken } from "../utils/jwt.js";
import { addUser, AppError } from "@repo/functions";

// export const signUp = async (req: Request, res: Response) => {
//   try {
//     const result = await addUser(req.body);
//     res.status(result.status).json(result);
//   }catch(error) {
//     if (error instanceof AppError){
//       return res.status(error.status).json({error: error.message});
//     }
//     return res.status(500).json({
//       error: "Internal Server Error"
//     })
//   }
// };

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
      secure: false, // secure only in production
      sameSite: "none", // or "strict", adjust as per your needs
      maxAge: 24 * 30 * 60 * 60 * 1000,
      path: "/", // cookie available for entire domain
    });

    return res.status(201).json({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });
  } catch(err) {
    return res.status(500).json({
      error: "Internal Server Error!!!",
      err
    });
  }
};
