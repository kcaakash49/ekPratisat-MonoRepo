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

export const getZoneByIdController = async (req: Request, res: Response) => {
  try {
    console.log("Received request for zone details with params:", req.params);
    const { id: zoneId } = req.params;

    if (!zoneId || typeof zoneId !== "string") {
      throw new AppError(400, "Invalid Zone ID");
    }

    const zone = await prisma.$queryRaw<
  {
    id: string;
    name: string;
    notes: string | null;
    geom: any; // better: JSON instead of string
    properties: {
      id: string;
      title: string;
      lat: number;
      lng: number;
    }[];
  }[]
>`
  SELECT 
    z.id,
    z.name,
    z.notes,
    ST_AsGeoJSON(z.geom)::json AS geom,

    COALESCE(
      json_agg(
        json_build_object(
          'id', p.id,
          'title', p.title,
          'lat', ST_Y(p."geoPoint"),
          'lng', ST_X(p."geoPoint")
        )
      ) FILTER (WHERE p.id IS NOT NULL),
      '[]'
    ) AS properties

  FROM "GeoZone" z

  LEFT JOIN "Property" p
    ON ST_Contains(z.geom, p."geoPoint")

  WHERE z.id = ${zoneId}

  GROUP BY z.id, z.name, z.notes;
`;

    if (!zone || zone.length === 0) {
      throw new AppError(404, "Zone not found");
    }

    return res.status(200).json({
      zone: zone[0],
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
};