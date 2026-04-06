/*
  Warnings:

  - Added the required column `assignedById` to the `AgentGeoZone` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AgentGeoZone" ADD COLUMN     "assignedById" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "AgentGeoZone" ADD CONSTRAINT "AgentGeoZone_assignedById_fkey" FOREIGN KEY ("assignedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
