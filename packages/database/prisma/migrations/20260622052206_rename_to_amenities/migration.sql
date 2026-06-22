/*
  Warnings:

  - You are about to drop the `Amneties` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_AmnetiesToProperty` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_AmnetiesToProperty" DROP CONSTRAINT "_AmnetiesToProperty_A_fkey";

-- DropForeignKey
ALTER TABLE "_AmnetiesToProperty" DROP CONSTRAINT "_AmnetiesToProperty_B_fkey";

-- DropTable
DROP TABLE "Amneties";

-- DropTable
DROP TABLE "_AmnetiesToProperty";

-- CreateTable
CREATE TABLE "Amenities" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Amenities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_AmenitiesToProperty" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_AmenitiesToProperty_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Amenities_name_key" ON "Amenities"("name");

-- CreateIndex
CREATE INDEX "_AmenitiesToProperty_B_index" ON "_AmenitiesToProperty"("B");

-- AddForeignKey
ALTER TABLE "_AmenitiesToProperty" ADD CONSTRAINT "_AmenitiesToProperty_A_fkey" FOREIGN KEY ("A") REFERENCES "Amenities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AmenitiesToProperty" ADD CONSTRAINT "_AmenitiesToProperty_B_fkey" FOREIGN KEY ("B") REFERENCES "Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;
