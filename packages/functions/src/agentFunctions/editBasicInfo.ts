import { EditAgentBasicProfileInput } from "@repo/validators";
import { prisma } from "@repo/database";
import { AppError } from "../error.js";


export async function editBasicInfo(payload: EditAgentBasicProfileInput) {
    try {
        const existingUser = await prisma.user.findUnique({
            where: {contact: payload.contact}
        })

        if (existingUser && existingUser.id !== payload.id) {
            throw new AppError(400, "Contact Already in Use!!!")
        }
        const user = await prisma.user.update({
            where: {id: payload.id},
            data: {
                name: payload.name,
                contact: payload.contact,
                secondContact:payload.secondaryContact
            }
        })
        if(!user) {
            return new AppError(404, "User Not Found!!!")
        }
        return {
            message: "Update Successfull!!!",
            status: 200
        }
    }catch(e) {
        if (e instanceof AppError) throw e;
        throw new AppError(500, "Server Error!!!")
    }
}