import { prisma } from "@repo/database";
import { AppError } from "@repo/functions";
import { Request, Response } from "express";


export const addDistrictController = async (req: Request, res: Response) => {
    try {
        const { id } = req.user;
        const { name } = req.body;

        const ifExisting = await prisma.district.findFirst({
            where: {
                name: name
            }
        });

        if (ifExisting) {
            return res.status(409).json({
                message: "District already exist!!!"
            })
        }

        const district = await prisma.district.create({
            data: {
                name,
                addedById: id
            }
        });

        return res.status(200).json({
            message: "District added Successfully",
            district
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal Server Error",
        });
    }
}



