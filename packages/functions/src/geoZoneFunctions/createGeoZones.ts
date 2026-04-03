import { randomUUID } from "crypto";
import { prisma } from "@repo/database";
import { AppError } from "../error.js";
import type { FeatureCollection, Geometry } from "geojson";

type CreateGeoZoneInput = {
  userId: string;
  formData: {
    name: string;
    notes?: string | null;
    featureCollection: FeatureCollection<Geometry>;
  };
};

type ValidationRow = {
  invalid_count: bigint | number;
  reason: string | null;
};

type InsertRow = {
  id: string;
};

type DegenerateRow = {
  is_degenerate: boolean;
};

type OverlapRow = {
  has_overlap: boolean;
};

export async function createGeoZone({ userId, formData }: CreateGeoZoneInput) {
  if (!userId) throw new AppError(401, "Unauthorized");

  const { name, notes, featureCollection } = formData;

  if (!name?.trim()) {
    throw new AppError(400, "Zone name required");
  }

  if (!featureCollection?.features?.length) {
    throw new AppError(400, "Polygon required");
  }

  const zoneId = randomUUID();
  const geojson = JSON.stringify(featureCollection);

  try {
    // Step 1: validate raw incoming geometry and get a real reason
    const validation = (await prisma.$queryRaw`
      WITH input AS (
        SELECT ${geojson}::jsonb AS fc
      ),
      geoms AS (
        SELECT ST_SetSRID(
          ST_GeomFromGeoJSON((f->>'geometry')::text),
          4326
        ) AS g
        FROM input,
        LATERAL jsonb_array_elements(fc->'features') f
      )
      SELECT
        COUNT(*) FILTER (WHERE NOT ST_IsValid(g)) AS invalid_count,
        MAX(
          CASE
            WHEN NOT ST_IsValid(g) THEN ST_IsValidReason(g)
            ELSE NULL
          END
        ) AS reason
      FROM geoms;
    `) as ValidationRow[];

    const invalidCount = Number(validation?.[0]?.invalid_count ?? 0);
    const invalidReason = validation?.[0]?.reason;

    if (invalidCount > 0) {
      throw new AppError(
        400,
        invalidReason || "Polygon is self-intersecting or invalid",
      );
    }

    // check degenerate
    const degenerateCheck = (await prisma.$queryRaw`
WITH input AS (
  SELECT ${geojson}::jsonb AS fc
),
geoms AS (
  SELECT
    ST_CollectionExtract(
      ST_MakeValid(
        ST_SetSRID(
          ST_GeomFromGeoJSON((f->>'geometry')::text),
          4326
        )
      ),
      3
    ) AS g
  FROM input,
  LATERAL jsonb_array_elements(fc->'features') f
),
merged AS (
  SELECT ST_Multi(ST_Collect(g))::geometry(MultiPolygon,4326) AS mg
  FROM geoms
)
SELECT ST_Area(mg) < 1 AS is_degenerate
FROM merged;
`) as DegenerateRow[];

    if (degenerateCheck?.[0]?.is_degenerate) {
      throw new AppError(400, "Polygon is too small or invalid shape");
    }

    // check overlap
    const overlapCheck = (await prisma.$queryRaw`
WITH input AS (
  SELECT ${geojson}::jsonb AS fc
),
geoms AS (
  SELECT
    ST_CollectionExtract(
      ST_MakeValid(
        ST_SetSRID(
          ST_GeomFromGeoJSON((f->>'geometry')::text),
          4326
        )
      ),
      3
    ) AS g
  FROM input,
  LATERAL jsonb_array_elements(fc->'features') f
),
merged AS (
  SELECT ST_Multi(ST_Collect(g))::geometry(MultiPolygon,4326) AS mg
  FROM geoms
)
SELECT EXISTS (
  SELECT 1 FROM "GeoZone"
  WHERE ST_Intersects("geom", (SELECT mg FROM merged))
) AS has_overlap;
`) as OverlapRow[];

    if (overlapCheck?.[0]?.has_overlap) {
      throw new AppError(400, "Zone overlaps with existing zone");
    }

    const result = (await prisma.$queryRaw`
WITH input AS (
  SELECT ${geojson}::jsonb AS fc
),

-- Parse + normalize
geoms AS (
  SELECT
    ST_CollectionExtract(
      ST_MakeValid(
        ST_SetSRID(
          ST_GeomFromGeoJSON((f->>'geometry')::text),
          4326
        )
      ),
      3
    ) AS g
  FROM input,
  LATERAL jsonb_array_elements(fc->'features') f
),

-- Remove empty garbage
validated AS (
  SELECT g
  FROM geoms
  WHERE NOT ST_IsEmpty(g)
),

-- Merge into single MultiPolygon
merged AS (
  SELECT ST_Multi(ST_Collect(g))::geometry(MultiPolygon,4326) AS mg
  FROM validated
),

-- ❗ Reject degenerate (straight line / tiny)
degenerate AS (
  SELECT 1
  FROM merged
  WHERE ST_Area(mg) < 1  -- adjust threshold if needed
),

-- ❗ Reject overlap with existing zones
conflict AS (
  SELECT 1
  FROM "GeoZone"
  WHERE ST_Intersects("geom", (SELECT mg FROM merged))
  LIMIT 1
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
  ${name.trim()},
  ${notes?.trim() || null},
  true,
  mg,
  ${userId},
  NOW(),
  NOW()
FROM merged
WHERE
  NOT EXISTS (SELECT 1 FROM degenerate)
  AND NOT EXISTS (SELECT 1 FROM conflict)
RETURNING "id";
`) as InsertRow[];

    return {
      status: 200,
      message: "Geo zone created successfully",
      result,
    };
  } catch (error: any) {
    if (error instanceof AppError) {
      throw error;
    }

    const message = String(error?.message || "");

    if (message.includes("Self-intersection")) {
      throw new AppError(400, "Polygon is self-intersecting");
    }

    if (message.includes("GeometryCollection")) {
      throw new AppError(400, "Polygon is invalid after geometry cleanup");
    }

    if (message.includes("parse") || message.includes("GeoJSON")) {
      throw new AppError(400, "Invalid GeoJSON polygon");
    }

    throw new AppError(500, "Internal Server Error");
  }
}
