// @repo/actions/user.ts
"use server";

import { authOptions } from "@repo/auth-config";
import { AppError, createUser, signInUser } from "@repo/functions";
import { UserSigninSchema, UserSingUpSchema } from "@repo/validators";
import { getServerSession } from "next-auth";

export async function addUserAction(formData: FormData) {
  // try {
  //   return await createUser(formData);
  // } catch (error) {
  //   if (error instanceof AppError) {
  //     return { status: error.status, error: error.message, fieldErrors: error.fieldErrors };
  //   }
  //   return { status: 500, error: "Unexpected error" };
  // }
  try {
    const userRole = formData.get("role");
    const isVerified = formData.get("isVerified");
    if (userRole === "partner") {
      const session = await getServerSession(authOptions);
      if (!session || !(session.user.role === "admin")) {
        throw new AppError(401, "Unauthorized");
      }
      formData.append("createdById", session.user.id);
      if (isVerified) {
        formData.append("verifiedById", session.user.id);
      }
      return await createUser(formData);
    }
    return await createUser(formData);
  } catch (error) {
    if (error instanceof AppError) {
      return {
        status: error.status,
        error: error.message,
        fieldErrors: error.fieldErrors,
      };
    }
    return { status: 500, error: "Unexpected error" };
  }
}

export async function signinAction(credentials: UserSigninSchema) {
  // try {
  //   return await signInUser(credentials);
  // } catch(error) {
  //   if (error instanceof AppError) {
  //     return { status: error.status, error: error.message, fieldErrors: error.fieldErrors };
  //   }
  //   return { status: 500, error: "Unexpected error" };
  // }
  return await signInUser(credentials);
}
