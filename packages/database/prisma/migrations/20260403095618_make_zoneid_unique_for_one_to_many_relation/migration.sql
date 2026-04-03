/*
  Warnings:

  - A unique constraint covering the columns `[zoneId]` on the table `AgentGeoZone` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "AgentGeoZone_zoneId_key" ON "public"."AgentGeoZone"("zoneId");

-- RenameIndex
ALTER INDEX "public"."GeoZone_geom_gix" RENAME TO "GeoZone_geom_idx";

-- RenameIndex
ALTER INDEX "public"."Property_geoPoint_gix" RENAME TO "Property_geoPoint_idx";
