/*
  Warnings:

  - Made the column `geoPoint` on table `Property` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."Property" ALTER COLUMN "geoPoint" SET NOT NULL;
