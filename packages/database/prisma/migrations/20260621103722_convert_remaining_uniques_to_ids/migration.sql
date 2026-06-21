-- ==========================================================
-- 🔄 STEP 1: CONVERT ALL '@unique' ID FIELDS TO TRUE PRIMARY KEYS
-- ==========================================================

-- User
ALTER TABLE "User" ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");
DROP INDEX "User_id_key" CASCADE;

-- Property
ALTER TABLE "Property" ADD CONSTRAINT "Property_pkey" PRIMARY KEY ("id");
DROP INDEX "Property_id_key" CASCADE;

-- Category
ALTER TABLE "Category" ADD CONSTRAINT "Category_pkey" PRIMARY KEY ("id");
DROP INDEX "Category_id_key" CASCADE;

-- District
ALTER TABLE "District" ADD CONSTRAINT "District_pkey" PRIMARY KEY ("id");
DROP INDEX "District_id_key" CASCADE;

-- Municipality
ALTER TABLE "Municipality" ADD CONSTRAINT "Municipality_pkey" PRIMARY KEY ("id");
DROP INDEX "Municipality_id_key" CASCADE;

-- Ward
ALTER TABLE "Ward" ADD CONSTRAINT "Ward_pkey" PRIMARY KEY ("id");
DROP INDEX "Ward_id_key" CASCADE;

-- Image
ALTER TABLE "Image" ADD CONSTRAINT "Image_pkey" PRIMARY KEY ("id");
DROP INDEX "Image_id_key" CASCADE;

-- Lead
ALTER TABLE "Lead" ADD CONSTRAINT "Lead_pkey" PRIMARY KEY ("id");
DROP INDEX "Lead_id_key" CASCADE;

-- UserDocument
ALTER TABLE "UserDocument" ADD CONSTRAINT "UserDocument_pkey" PRIMARY KEY ("id");
DROP INDEX "UserDocument_id_key" CASCADE;

-- PartnerWardAssignment
ALTER TABLE "PartnerWardAssignment" ADD CONSTRAINT "PartnerWardAssignment_pkey" PRIMARY KEY ("id");
DROP INDEX "PartnerWardAssignment_id_key" CASCADE;


-- ==========================================================
-- 🏗️ STEP 2: CREATE DYNAMIC AMENITIES TABLES
-- ==========================================================

CREATE TABLE "Amneties" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Amneties_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "_AmnetiesToProperty" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_AmnetiesToProperty_AB_pkey" PRIMARY KEY ("A","B")
);

CREATE UNIQUE INDEX "Amneties_name_key" ON "Amneties"("name");
CREATE INDEX "_AmnetiesToProperty_B_index" ON "_AmnetiesToProperty"("B");


-- ==========================================================
-- 🛡️ STEP 3: PRE-CLEAN SURVIVING FOREIGNEY CONSTRAINTS
-- ==========================================================

ALTER TABLE "AgentGeoZone" DROP CONSTRAINT IF EXISTS "AgentGeoZone_zoneId_fkey";
ALTER TABLE "Favourite" DROP CONSTRAINT IF EXISTS "Favourite_userId_fkey";
ALTER TABLE "Favourite" DROP CONSTRAINT IF EXISTS "Favourite_propertyId_fkey";
ALTER TABLE "Image" DROP CONSTRAINT IF EXISTS "Image_propertyId_fkey";
ALTER TABLE "Lead" DROP CONSTRAINT IF EXISTS "Lead_propertyId_fkey";
ALTER TABLE "NotificationRecipient" DROP CONSTRAINT IF EXISTS "NotificationRecipient_notificationEventId_fkey";
ALTER TABLE "NotificationRecipient" DROP CONSTRAINT IF EXISTS "NotificationRecipient_recipientId_fkey";


-- ==========================================================
-- 🔗 STEP 4: RE-ATTACH ALL SYSTEM FOREIGN KEY CONSTRAINTS
-- ==========================================================

-- User self-relations (Audit Trails)
ALTER TABLE "User" ADD CONSTRAINT "User_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "User" ADD CONSTRAINT "User_verifiedById_fkey" FOREIGN KEY ("verifiedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- UserDocument relations
ALTER TABLE "UserDocument" ADD CONSTRAINT "UserDocument_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "UserDocument" ADD CONSTRAINT "UserDocument_verifiedById_fkey" FOREIGN KEY ("verifiedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AgentGeoZone relations
ALTER TABLE "AgentGeoZone" ADD CONSTRAINT "AgentGeoZone_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "AgentGeoZone" ADD CONSTRAINT "AgentGeoZone_assignedById_fkey" FOREIGN KEY ("assignedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "AgentGeoZone" ADD CONSTRAINT "AgentGeoZone_zoneId_fkey" FOREIGN KEY ("zoneId") REFERENCES "GeoZone"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- GeoZone relations
ALTER TABLE "GeoZone" ADD CONSTRAINT "GeoZone_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- PartnerWardAssignment relations
ALTER TABLE "PartnerWardAssignment" ADD CONSTRAINT "PartnerWardAssignment_partnerId_fkey" FOREIGN KEY ("partnerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "PartnerWardAssignment" ADD CONSTRAINT "PartnerWardAssignment_wardId_fkey" FOREIGN KEY ("wardId") REFERENCES "Ward"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Category relations
ALTER TABLE "Category" ADD CONSTRAINT "Category_addedById_fkey" FOREIGN KEY ("addedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Property Core relations
ALTER TABLE "Property" ADD CONSTRAINT "Property_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Property" ADD CONSTRAINT "Property_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Property" ADD CONSTRAINT "Property_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Ward"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Favourite relations
ALTER TABLE "Favourite" ADD CONSTRAINT "Favourite_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Favourite" ADD CONSTRAINT "Favourite_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- District relations
ALTER TABLE "District" ADD CONSTRAINT "District_addedById_fkey" FOREIGN KEY ("addedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Municipality relations
ALTER TABLE "Municipality" ADD CONSTRAINT "Municipality_districtId_fkey" FOREIGN KEY ("districtId") REFERENCES "District"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Municipality" ADD CONSTRAINT "Municipality_addedById_fkey" FOREIGN KEY ("addedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Ward relations
ALTER TABLE "Ward" ADD CONSTRAINT "Ward_municipalityId_fkey" FOREIGN KEY ("municipalityId") REFERENCES "Municipality"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Ward" ADD CONSTRAINT "Ward_addedById_fkey" FOREIGN KEY ("addedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Image relations (Ensures all your live house images stay linked)
ALTER TABLE "Image" ADD CONSTRAINT "Image_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Lead relations
ALTER TABLE "Lead" ADD CONSTRAINT "Lead_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Lead" ADD CONSTRAINT "Lead_managedById_fkey" FOREIGN KEY ("managedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Lead" ADD CONSTRAINT "Lead_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- NotificationEvent relations
ALTER TABLE "NotificationEvent" ADD CONSTRAINT "NotificationEvent_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- NotificationRecipient relations
ALTER TABLE "NotificationRecipient" ADD CONSTRAINT "NotificationRecipient_notificationEventId_fkey" FOREIGN KEY ("notificationEventId") REFERENCES "NotificationEvent"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "NotificationRecipient" ADD CONSTRAINT "NotificationRecipient_recipientId_fkey" FOREIGN KEY ("recipientId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Many-to-Many Dynamic Amenities Join constraints
ALTER TABLE "_AmnetiesToProperty" ADD CONSTRAINT "_AmnetiesToProperty_A_fkey" FOREIGN KEY ("A") REFERENCES "Amneties"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "_AmnetiesToProperty" ADD CONSTRAINT "_AmnetiesToProperty_B_fkey" FOREIGN KEY ("B") REFERENCES "Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;