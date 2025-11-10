
import { prisma } from "@repo/database";
import { AppError } from "../error.js";

export async function getAgentDetai(id: string) {
    
    try {
        const result = await prisma.user.findUnique({
            where: {id},
            select: {
                id:true,
                name: true,
                contact: true,
                profileImageUrl:true,
                createdAt: true,
                email: true,
                createdBy: {
                    select: {
                        id:true,
                        name:true
                    }
                },
                documents: {
                    select: {
                        id: true,
                        isVerified:true,
                        url:true
                    }
                }
            }
        });
        if(!result) {
            throw new AppError(404, "No such Agent Exist")
        }

        return {
            status:200,
            result
        }

    }catch(error){
        if (error instanceof AppError) throw error;
        throw new AppError(500, "Couldn't fetch user detal!!!")
    }
}