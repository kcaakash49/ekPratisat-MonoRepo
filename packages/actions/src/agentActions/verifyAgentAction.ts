
"use server"

import { authOptions } from "@repo/auth-config"
import { AppError, verifyAgent } from "@repo/functions";
import { getServerSession } from "next-auth"

export async function verifyAgentAction(userId: string) {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
        throw new AppError(401, "Unauthorized")
    }

    const verifiedById = session.user.id;
    return await verifyAgent({userId, verifiedById});
}