import { Prisma, prisma } from "@repo/database";
import { AppError } from "../error.js";

export async function verifyAgent({userId, verifiedById} : {userId: string, verifiedById: string}){
    try {
        const result = await prisma.user.update({
            where: { id: userId },
            data : {
                isVerified: true,
                verifiedById: verifiedById,
                documents: {
                    updateMany: {
                        where: {userId},
                        data: {
                            isVerified: true,
                            verifiedById: verifiedById
                        }
                    } 
                }
            }
        })
        return {
            status: 200,
            result
        }
    }catch(error){
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            throw new AppError(500, "Couldn't update in database!!!")
        }

        throw new AppError(500, "Something happened, update unsuccessful!!!");
    }
}