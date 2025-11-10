import { prisma } from "@repo/database";
import { AppError } from "../error.js";

export async function getAgentList() {
  try {
    const result = await prisma.user.findMany({
        where: {
            role: "partner"
        },select: {
            id: true,
            name: true,
            contact: true,
            isVerified: true,
            createdBy: {
                select: {
                    id: true,
                    name: true
                }
            }
        },orderBy: {
            createdAt: 'desc'
        }
    });
    return { status: 200, result };

  } catch (error) {
        throw new AppError(500, "Couldn't fetch data");
  }
}
