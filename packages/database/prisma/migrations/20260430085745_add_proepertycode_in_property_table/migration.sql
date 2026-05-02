/*
  Warnings:

  - A unique constraint covering the columns `[propertyCode]` on the table `Property` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Property" ADD COLUMN     "propertyCode" SERIAL NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Property_propertyCode_key" ON "Property"("propertyCode");
