/*
  Warnings:

  - Added the required column `tole` to the `Property` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Property" ADD COLUMN     "tole" TEXT NOT NULL;
