/*
  Warnings:

  - A unique constraint covering the columns `[coverImageId]` on the table `Property` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Property" ADD COLUMN     "coverImageId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Property_coverImageId_key" ON "Property"("coverImageId");

-- AddForeignKey
ALTER TABLE "Property" ADD CONSTRAINT "Property_coverImageId_fkey" FOREIGN KEY ("coverImageId") REFERENCES "Image"("id") ON DELETE SET NULL ON UPDATE CASCADE;
