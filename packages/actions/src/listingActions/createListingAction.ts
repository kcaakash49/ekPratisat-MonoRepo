"use server";

import { authOptions } from "@repo/auth-config";
import { AppError, createListingFunction } from "@repo/functions";
import { CreatePropertySchema } from "@repo/validators";
import { getServerSession } from "next-auth";

export async function createListingAction(formData: CreatePropertySchema){
    const session = await getServerSession(authOptions);

    if(!session){
        throw new AppError(401, "UnAuthorized");
    }

    const userId = session.user.id;

    return await createListingFunction({formData, userId});

}