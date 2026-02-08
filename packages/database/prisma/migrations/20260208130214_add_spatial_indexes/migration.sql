-- This is an empty migration.-- Spatial indexes (PostGIS)
CREATE INDEX IF NOT EXISTS "GeoZone_geom_gix"
ON "public"."GeoZone" USING GIST ("geom");

CREATE INDEX IF NOT EXISTS "Property_geoPoint_gix"
ON "public"."Property" USING GIST ("geoPoint");