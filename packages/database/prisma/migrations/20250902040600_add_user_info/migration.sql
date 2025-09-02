/*
  Warnings:

  - A unique constraint covering the columns `[contact]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `contact` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."UserRole" AS ENUM ('admin', 'partner', 'client');

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "contact" TEXT NOT NULL,
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "password" TEXT NOT NULL,
ADD COLUMN     "role" "public"."UserRole" NOT NULL DEFAULT 'client';

-- CreateIndex
CREATE UNIQUE INDEX "User_contact_key" ON "public"."User"("contact");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");
