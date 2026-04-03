import { prisma } from "@repo/database";
import { AppError, createGeoZone } from "@repo/functions";
import { Request, Response } from "express";

export const createZoneController = async (req: Request, res: Response) => {
    try {
        const { id } = req.user;
        const formData = req.body;

        const result = await createGeoZone({ userId: id, formData });

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
            message: "Internal Server Error!!!",
        });
    }
}

export const getZonesController = async (req: Request, res: Response) => {  
    try {
        const zones = await prisma.$queryRaw`
    SELECT 
      id,
      name,
      notes,
      ST_AsGeoJSON(geom)::json AS geom
    FROM "GeoZone"
    WHERE "isActive" = true
  `;
        return res.status(200).json({ zones });
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error!!!",
        });
    }
}

export const deleteZoneController = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const zone = await prisma.geoZone.findUnique({
            where: { id }
        });

        if (!zone) {
            return res.status(404).json({
                message: "Zone not found!!!",
            });
        }

        await prisma.geoZone.update({
            where: { id },
            data: { isActive: false },
        });

        return res.status(200).json({
            message: "Zone deleted successfully!!!",
        });
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error!!!",
        });
    }
}