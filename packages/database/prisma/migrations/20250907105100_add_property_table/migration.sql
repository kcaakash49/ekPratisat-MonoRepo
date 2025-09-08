-- CreateEnum
CREATE TYPE "public"."SaleType" AS ENUM ('rent', 'sale');

-- CreateTable
CREATE TABLE "public"."Category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "isLandAreaNeeded" BOOLEAN NOT NULL,
    "isNoOfFloorsNeeded" BOOLEAN NOT NULL,
    "isNoOfRoomsNeeded" BOOLEAN NOT NULL,
    "isAgeOfThePropertyNeeded" BOOLEAN NOT NULL,
    "isNoOfRestRoomsNeeded" BOOLEAN NOT NULL,
    "isFacingDirectionNeeded" BOOLEAN NOT NULL,
    "isFloorAreaNeeded" BOOLEAN NOT NULL,
    "isFloorLevelNeeded" BOOLEAN NOT NULL,
    "isRoadSizeNeeded" BOOLEAN NOT NULL,
    "addedById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "public"."Property" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" TEXT NOT NULL,
    "type" "public"."SaleType" NOT NULL,
    "categoryId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "noOfBedRooms" TEXT,
    "noOfRestRooms" TEXT,
    "landArea" TEXT,
    "noOfFloors" TEXT,
    "propertyAge" TEXT,
    "facingDirection" TEXT,
    "floorArea" TEXT,
    "roadSize" TEXT,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "locationId" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "public"."District" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "public"."Municipality" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "districtId" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "public"."Ward" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "municipalityId" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "public"."Image" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Category_id_key" ON "public"."Category"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Property_id_key" ON "public"."Property"("id");

-- CreateIndex
CREATE UNIQUE INDEX "District_id_key" ON "public"."District"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Municipality_id_key" ON "public"."Municipality"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Ward_id_key" ON "public"."Ward"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Image_id_key" ON "public"."Image"("id");

-- AddForeignKey
ALTER TABLE "public"."Category" ADD CONSTRAINT "Category_addedById_fkey" FOREIGN KEY ("addedById") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Property" ADD CONSTRAINT "Property_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "public"."Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Property" ADD CONSTRAINT "Property_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Property" ADD CONSTRAINT "Property_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "public"."Ward"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Municipality" ADD CONSTRAINT "Municipality_districtId_fkey" FOREIGN KEY ("districtId") REFERENCES "public"."District"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Ward" ADD CONSTRAINT "Ward_municipalityId_fkey" FOREIGN KEY ("municipalityId") REFERENCES "public"."Municipality"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Image" ADD CONSTRAINT "Image_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "public"."Property"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
