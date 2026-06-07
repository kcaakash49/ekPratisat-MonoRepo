/*
  Warnings:

  - You are about to drop the column `saleType` on the `Lead` table. All the data in the column will be lost.
  - Added the required column `dealType` to the `Lead` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "DealType" AS ENUM ('buy', 'sell', 'rent');

-- AlterTable
ALTER TABLE "Lead" DROP COLUMN "saleType",
ADD COLUMN     "dealType" "DealType" NOT NULL;
