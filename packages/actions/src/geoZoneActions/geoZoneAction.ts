"use server";

import { authOptions } from "@repo/auth-config";
import { AppError, createGeoZone } from "@repo/functions";
import { getServerSession } from "next-auth";

export async function createGeoZoneAction(formData:any) {
    const session = await getServerSession(authOptions);
    if (!session){
        throw new AppError(401, "Unauthorized");
    }

    const userId = session?.user?.id;

    return await createGeoZone({userId, formData});
}