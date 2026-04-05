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
};

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
};

export const deleteZoneController = async (req: Request, res: Response) => {
  try {
    const { id: zoneId } = req.params; 

    if (!zoneId || typeof zoneId !== 'string') {
      throw new AppError(400, "Invalid Zone ID");
    }
    
    const deleted = await prisma.$executeRaw`
  DELETE FROM "GeoZone"
  WHERE id = ${zoneId}
  AND NOT EXISTS (
    SELECT 1 FROM "AgentGeoZone"
    WHERE "zoneId" = ${zoneId}
  )
`;

    if (deleted === 0) {
      const assigned = await prisma.agentGeoZone.findMany({
        where: { zoneId },
        include: {
          agent: {
            select: {
              id: true,
              name: true,
              contact: true,
            },
          },
        },
      });

      const names = assigned.map((a) => a.agent.name).join(", ");

      throw new AppError(400, `Zone is assigned to: ${names}`);
    }

    return res.status(200).json({
      message: "Zone deleted successfully!!!",
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
};
