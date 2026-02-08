import { AppError } from "../error.js";
import { prisma } from "@repo/database";
import { randomUUID } from "crypto";

export async function createGeoZone({
  userId,
  formData,
}: {
  userId: string;
  formData: any;
}) {
  if (!userId) throw new AppError(401, "Unauthorized");

  try {
    const zoneId = randomUUID();

    const { name, notes, featureCollection } = formData;

    if (!name) throw new AppError(400, "Zone name required");
    if (!featureCollection?.features?.length)
      throw new AppError(400, "Polygon required");

    const geojson = JSON.stringify(featureCollection);

    const result = await prisma.$queryRaw`
      WITH input AS (
        SELECT ${geojson}::jsonb AS fc
      ),
      geoms AS (
        SELECT ST_MakeValid(
          ST_SetSRID(
            ST_GeomFromGeoJSON((f->>'geometry')::text),
            4326
          )
        ) AS g
        FROM input,
        LATERAL jsonb_array_elements(fc->'features') f
      ),
      merged AS (
        SELECT ST_Multi(ST_Collect(g))::geometry(MultiPolygon,4326) AS mg
        FROM geoms
      )
      INSERT INTO "public"."GeoZone" (
        "id",
        "name",
        "notes",
        "isActive",
        "geom",
        "createdById",
        "createdAt",
        "updatedAt"
      )
      SELECT
        ${zoneId},
        ${name},
        ${notes ?? null},
        true,
        mg,
        ${userId},
        NOW(),
        NOW()
      FROM merged
      RETURNING "id";
    `;

    return {
      status: 200,
      message: "Category zone Successfully",
      result,
    };
  } catch (e) {
    if (e instanceof AppError) {
      throw e;
    }
    throw new AppError(500, "Internal Server Error");
  }
}
