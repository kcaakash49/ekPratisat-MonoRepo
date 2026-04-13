-- DropIndex
DROP INDEX "Property_userId_idx";

-- AlterTable
ALTER TABLE "Property" ADD COLUMN     "isFeatured" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX "Property_userId_isActive_idx" ON "Property"("userId", "isActive");
