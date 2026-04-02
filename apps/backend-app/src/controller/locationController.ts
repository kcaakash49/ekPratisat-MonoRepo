import { prisma } from "@repo/database";
import { addDistrict, addMunicipality, addWard, AppError } from "@repo/functions";
import { Request, Response } from "express";


export const addDistrictController = async (req: Request, res: Response) => {
    try {
        const { id } = req.user;
        const { name } = req.body;

        const result = await addDistrict({ name, userId: id });

        return res.status(result.status).json({
            message: result.message
        })

    } catch (error) {
        if (error instanceof AppError) {
            return res.status(error.status).json({
                message: error.message,
            });
        }
        return res.status(500).json({
            message: "Internal Server Error",
        });
    }
}



export const addMunicipalityController = async (req: Request, res: Response) => {
    try {
        const { id } = req.user;
        const { name, parentId } = req.body;

        const result = await addMunicipality({ name, userId: id, parentId });

        return res.status(result.status).json({
            message: result.message,
        });
    } catch (error) {
        if (error instanceof AppError) {
            return res.status(error.status).json({
                message: error.message,
            });
        }
        return res.status(500).json({
            message: "Internal Server Error",
        });
    }
}

export const addWardController = async (req: Request, res: Response) => {
    try {
        const { id } = req.user;
        const { name, parentId } = req.body;

        const result = await addWard({ name, userId: id, parentId });

        return res.status(result.status).json({
            message: result.message,
        });
    } catch (error) {
        if (error instanceof AppError) {
            return res.status(error.status).json({
                message: error.message,
            });
        }
        return res.status(500).json({
            message: "Internal Server Error",
        });
    }
}   