-- AlterTable
-- Enable PostGIS (must run before any geometry types are used)
CREATE EXTENSION IF NOT EXISTS postgis;

-- AlterTable
ALTER TABLE "public"."Property"
ADD COLUMN "geoPoint" geometry(Point, 4326);
