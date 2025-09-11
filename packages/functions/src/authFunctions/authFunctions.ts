// @repo/functions/user.ts
import { prisma } from "@repo/database";
import { userSigninSchema, UserSigninSchema, userSignupSchema, UserSingUpSchema } from "@repo/validators";
import { AppError } from "../error.js";
import bcrypt from 'bcrypt';


export async function addUser(credentials: UserSingUpSchema)  {
  const result = userSignupSchema.safeParse(credentials);
  

  if (!result.success) {
    const fieldErrors = result.error.flatten().fieldErrors;
    const firstErrorPerField: Record<string, string> = {};
  
    (Object.keys(fieldErrors) as Array<keyof typeof fieldErrors>).forEach((key) => {
      const firstError = fieldErrors[key]?.[0];
      if (firstError) {
        firstErrorPerField[key] = firstError; // string only
      }
    });
  
    throw new AppError(422, "Validation failed", firstErrorPerField);
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
          throw new AppError(400, "Contact already in use", { contact: "Contact already in use"});
        }
        if (ifExistingUser.email === result.data.email) {
          throw new AppError(400, "Email already in use", { email: "Email already in use"});
        }
      }

      const hashPassword = await bcrypt.hash(result.data.password, 9);

      const user = await tx.user.create({
        data: {
          ...result.data, password: hashPassword
        },
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


//SignIn logic
export async function signInUser(credentials: UserSigninSchema){
  const result = userSigninSchema.safeParse(credentials);

  if (!result.success) {
    throw new AppError(422, "Validation Failed")
  }
  try {
    const user = await prisma.user.findUnique({
      where: {
        contact: result.data.contact
      }
    });

    if(!user) {
      throw new AppError(404, "User Not Found" , { contact: "User Not Found"});
    }

    const comparePassword = await bcrypt.compare(result.data.password, user?.password);
    if(!comparePassword) {
      throw new AppError(404, "Password didn't match.", { password: "Password didn't match."})
    }

    return {
      status: 200,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    }

  } catch (error) {
      if (error instanceof AppError){
        throw error;
      }
      throw new AppError(500, "Internal Server Error !!!")
  }
}