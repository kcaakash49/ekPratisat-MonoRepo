import { prisma } from "@repo/database";
import { Request, Response } from "express";


export async function getStaff(req: Request, res:Response) {
    try {
        const result = await prisma.user.findMany({
        where: {
            role: "staff",
            isActive: true
        },select: {
            id: true,
            name: true,
            contact: true,
            isVerified: true,
            createdAt:true,
            secondContact: true,
            createdBy: {
                select: {
                    id: true,
                    name: true
                }
            }
        },orderBy: {
            createdAt: 'desc'
        }
    })

        return res.status(200).json(result);

    } catch (error) {
        return res.status(500).json({ error: "Couldn't fetch data" });
    }
}
