// @repo/actions/user.ts
"use server";

import { addUser, AppError } from "@repo/functions";
import { UserSingUpSchema } from "@repo/validators";

export async function addUserAction(credentials: UserSingUpSchema) {
    try {
      return await addUser(credentials);
    } catch (error) {
      if (error instanceof AppError) {
        return { status: error.status, error: error.message, fieldErrors: error.fieldErrors };
      }
      return { status: 500, error: "Unexpected error" };
    }
}
