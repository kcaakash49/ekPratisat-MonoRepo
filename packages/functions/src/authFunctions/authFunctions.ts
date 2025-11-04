// @repo/functions/user.ts
import { prisma } from "@repo/database";
import {
  userSigninSchema,
  UserSigninSchema,
} from "@repo/validators";
import { AppError } from "../error.js";
import bcrypt from "bcrypt";



//SignIn logic
export async function signInUser(credentials: UserSigninSchema) {
  const result = userSigninSchema.safeParse(credentials);

  if (!result.success) {
    throw new AppError(422, "Validation Failed");
  }
  try {
    const user = await prisma.user.findUnique({
      where: {
        contact: result.data.contact,
      },
    });

    if (!user) {
      throw new AppError(404, "User Not Found", { contact: "User Not Found" });
    }

    const comparePassword = await bcrypt.compare(
      result.data.password,
      user?.password
    );
    if (!comparePassword) {
      throw new AppError(404, "Password didn't match.", {
        password: "Password didn't match.",
      });
    }

    return {
      status: 200,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        profileImageUrl: user.profileImageUrl
      },
    };
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(500, "Internal Server Error !!!");
  }
}
