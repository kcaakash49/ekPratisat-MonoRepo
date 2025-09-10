import { prisma } from "@repo/database";
import { userSignupSchema, UserSingUpSchema } from "@repo/validators";

// @repo/functions - Modify addUser to throw errors
export async function addUser(credentials: UserSingUpSchema){
    try {
        const result = userSignupSchema.safeParse(credentials);
        if (!result.success){
            return {
                status: 422
            }
        }

        const response = await prisma.$transaction(async (tx) => {
            const ifExistingUser = await tx.user.findFirst({
                where: {
                    OR: [{ contact: result.data.contact}, { email: result.data.email}]
                }
            })

            if (ifExistingUser){
                if (ifExistingUser.contact === result.data.contact){
                    return {
                        status: 400,
                        error: "Contact already Used"
                    }
                }
                if (ifExistingUser.email === result.data.email){
                    return {
                        status: 400,
                        error: "Email already Used"
                    }
                }
            }
            
            const user = await tx.user.create({
                data: result.data
            })

            return {
                status: 200,
                user: {
                    id: user.id,
                    role: user.role,
                    name: user.name
                }
            }
        })

        return response;
    } catch (error) {
        if (error instanceof Error) {
            // Re-throw with structured error information
            throw new Error(error.message, { cause: error.cause });
        }
        throw new Error('Internal server error', { 
            cause: { status: 500, error: "Internal server error" } 
        });
    }
}