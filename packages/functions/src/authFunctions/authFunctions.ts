// @repo/functions/user.ts
import { prisma } from "@repo/database";
import { userSignupSchema, UserSingUpSchema } from "@repo/validators";
import { AppError } from "../error.js";


export async function addUser(credentials: UserSingUpSchema) {
  const result = userSignupSchema.safeParse(credentials);
  if (!result.success) {
    throw new AppError(422, "Validation failed");
  }

  try {
    const response = await prisma.$transaction(async (tx) => {
      const ifExistingUser = await tx.user.findFirst({
        where: {
          OR: [{ contact: result.data.contact }, { email: result.data.email }],
        },
      });

      if (ifExistingUser) {
        if (ifExistingUser.contact === result.data.contact) {
          throw new AppError(400, "Contact already in use");
        }
        if (ifExistingUser.email === result.data.email) {
          throw new AppError(400, "Email already in use");
        }
      }

      const user = await tx.user.create({
        data: result.data,
      });

      return {
        status: 200,
        user: {
          id: user.id,
          role: user.role,
          name: user.name,
        },
      };
    });

    return response;
  } catch (error) {
    if (error instanceof AppError) {
      throw error; // already structured
    }
    throw new AppError(500, "Internal server errors");
  }
}
