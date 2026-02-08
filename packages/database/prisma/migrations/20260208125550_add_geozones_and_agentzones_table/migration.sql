-- CreateTable
CREATE TABLE "public"."AgentGeoZone" (
    "agentId" TEXT NOT NULL,
    "zoneId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AgentGeoZone_pkey" PRIMARY KEY ("agentId","zoneId")
);

-- CreateTable
CREATE TABLE "public"."GeoZone" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "notes" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "geom" geometry(MultiPolygon, 4326) NOT NULL,
    "createdById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GeoZone_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AgentGeoZone_zoneId_idx" ON "public"."AgentGeoZone"("zoneId");

-- CreateIndex
CREATE INDEX "AgentGeoZone_agentId_idx" ON "public"."AgentGeoZone"("agentId");

-- AddForeignKey
ALTER TABLE "public"."AgentGeoZone" ADD CONSTRAINT "AgentGeoZone_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AgentGeoZone" ADD CONSTRAINT "AgentGeoZone_zoneId_fkey" FOREIGN KEY ("zoneId") REFERENCES "public"."GeoZone"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."GeoZone" ADD CONSTRAINT "GeoZone_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
