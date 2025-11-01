-- CreateEnum
CREATE TYPE "public"."DocumentType" AS ENUM ('CITIZENSHIP_FRONT', 'CITIZENSHIP_BACK', 'LICENSE', 'PAN', 'PASSPORT', 'OTHER');

-- AlterEnum
ALTER TYPE "public"."UserRole" ADD VALUE 'staff';

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "profileImageUrl" TEXT;

-- CreateTable
CREATE TABLE "public"."UserDocument" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "public"."DocumentType" NOT NULL,
    "url" TEXT NOT NULL,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "verifiedById" TEXT,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "UserDocument_id_key" ON "public"."UserDocument"("id");

-- AddForeignKey
ALTER TABLE "public"."UserDocument" ADD CONSTRAINT "UserDocument_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserDocument" ADD CONSTRAINT "UserDocument_verifiedById_fkey" FOREIGN KEY ("verifiedById") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
