// @repo/actions/user.ts
"use server";

import { AppError, createUser, signInUser } from "@repo/functions";
import { UserSigninSchema, UserSingUpSchema } from "@repo/validators";

export async function addUserAction(formData: FormData) {
    try {
      return await createUser(formData);
    } catch (error) {
      if (error instanceof AppError) {
        return { status: error.status, error: error.message, fieldErrors: error.fieldErrors };
      }
      return { status: 500, error: "Unexpected error" };
    }
}


export async function signinAction(credentials:UserSigninSchema) {
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