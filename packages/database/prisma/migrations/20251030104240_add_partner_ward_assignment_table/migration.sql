-- CreateTable
CREATE TABLE "public"."PartnerWardAssignment" (
    "id" TEXT NOT NULL,
    "partnerId" TEXT NOT NULL,
    "wardId" TEXT NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "PartnerWardAssignment_id_key" ON "public"."PartnerWardAssignment"("id");

-- CreateIndex
CREATE UNIQUE INDEX "PartnerWardAssignment_wardId_key" ON "public"."PartnerWardAssignment"("wardId");

-- CreateIndex
CREATE UNIQUE INDEX "PartnerWardAssignment_wardId_partnerId_key" ON "public"."PartnerWardAssignment"("wardId", "partnerId");

-- AddForeignKey
ALTER TABLE "public"."PartnerWardAssignment" ADD CONSTRAINT "PartnerWardAssignment_partnerId_fkey" FOREIGN KEY ("partnerId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PartnerWardAssignment" ADD CONSTRAINT "PartnerWardAssignment_wardId_fkey" FOREIGN KEY ("wardId") REFERENCES "public"."Ward"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
