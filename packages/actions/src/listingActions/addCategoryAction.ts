"use server"

import { authOptions } from "@repo/auth-config";
import { addCategory, AppError } from "@repo/functions";
import { CategorySchema } from "@repo/validators";
import { getServerSession } from "next-auth";


export async function addCategoryAction(formData:CategorySchema) {
    const session = await getServerSession(authOptions);
    if (!session) {
        throw new AppError(401, "Unauthorized");
    }

    const userId = session?.user?.id;

    const payload = {
        ...formData, addedById: userId
    }

    return await addCategory(payload);
}

